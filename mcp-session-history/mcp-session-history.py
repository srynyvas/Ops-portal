#!/usr/bin/env python3
"""
MCP Server for Claude Desktop Session Persistence
Stores and retrieves conversation history across sessions
"""

import asyncio
import json
import sqlite3
from datetime import datetime
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
import uuid

from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
)

# Database schema
DATABASE_SCHEMA = """
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT,
    role TEXT CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT,
    FOREIGN KEY (conversation_id) REFERENCES conversations (id)
);

CREATE TABLE IF NOT EXISTS session_state (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


@dataclass
class Message:
    id: str
    conversation_id: str
    role: str
    content: str
    timestamp: datetime
    metadata: Dict[str, Any] = None


@dataclass
class Conversation:
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = None
    metadata: Dict[str, Any] = None


class SessionPersistenceServer:
    def __init__(self, db_path: str = "claude_sessions.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize the SQLite database with required tables"""
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(DATABASE_SCHEMA)

    def create_conversation(self, title: str = None, metadata: Dict[str, Any] = None) -> str:
        """Create a new conversation and return its ID"""
        conversation_id = str(uuid.uuid4())
        if not title:
            title = f"Conversation {datetime.now().strftime('%Y-%m-%d %H:%M')}"

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO conversations (id, title, metadata) VALUES (?, ?, ?)",
                (conversation_id, title, json.dumps(metadata or {}))
            )
        return conversation_id

    def add_message(self, conversation_id: str, role: str, content: str, metadata: Dict[str, Any] = None) -> str:
        """Add a message to a conversation"""
        message_id = str(uuid.uuid4())

        with sqlite3.connect(self.db_path) as conn:
            # Add the message
            conn.execute(
                "INSERT INTO messages (id, conversation_id, role, content, metadata) VALUES (?, ?, ?, ?, ?)",
                (message_id, conversation_id, role, content, json.dumps(metadata or {}))
            )

            # Update conversation timestamp
            conn.execute(
                "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                (conversation_id,)
            )

        return message_id

    def get_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Retrieve a full conversation with all messages"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            # Get conversation info
            conv_row = conn.execute(
                "SELECT * FROM conversations WHERE id = ?", (conversation_id,)
            ).fetchone()

            if not conv_row:
                return None

            # Get messages
            message_rows = conn.execute(
                "SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp",
                (conversation_id,)
            ).fetchall()

            messages = [
                Message(
                    id=row['id'],
                    conversation_id=row['conversation_id'],
                    role=row['role'],
                    content=row['content'],
                    timestamp=datetime.fromisoformat(row['timestamp']),
                    metadata=json.loads(row['metadata'] or '{}')
                )
                for row in message_rows
            ]

            return Conversation(
                id=conv_row['id'],
                title=conv_row['title'],
                created_at=datetime.fromisoformat(conv_row['created_at']),
                updated_at=datetime.fromisoformat(conv_row['updated_at']),
                messages=messages,
                metadata=json.loads(conv_row['metadata'] or '{}')
            )

    def list_conversations(self, limit: int = 50) -> List[Conversation]:
        """List recent conversations"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            rows = conn.execute(
                "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ?",
                (limit,)
            ).fetchall()

            return [
                Conversation(
                    id=row['id'],
                    title=row['title'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at']),
                    metadata=json.loads(row['metadata'] or '{}')
                )
                for row in rows
            ]

    def search_conversations(self, query: str) -> List[Conversation]:
        """Search conversations by content"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            rows = conn.execute("""
                SELECT DISTINCT c.* FROM conversations c
                JOIN messages m ON c.id = m.conversation_id
                WHERE c.title LIKE ? OR m.content LIKE ?
                ORDER BY c.updated_at DESC
            """, (f"%{query}%", f"%{query}%")).fetchall()

            return [
                Conversation(
                    id=row['id'],
                    title=row['title'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at']),
                    metadata=json.loads(row['metadata'] or '{}')
                )
                for row in rows
            ]

    def set_session_state(self, key: str, value: Any):
        """Store session-level state"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO session_state (key, value) VALUES (?, ?)",
                (key, json.dumps(value))
            )

    def get_session_state(self, key: str) -> Any:
        """Retrieve session-level state"""
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT value FROM session_state WHERE key = ?", (key,)
            ).fetchone()

            return json.loads(row[0]) if row else None


# Initialize the persistence layer
persistence = SessionPersistenceServer()

# Create MCP server
server = Server("claude-session-persistence")


@server.list_tools()
async def handle_list_tools() -> List[Tool]:
    """List available tools for session persistence"""
    return [
        Tool(
            name="create_conversation",
            description="Create a new conversation session",
            inputSchema={
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Optional title for the conversation"},
                    "metadata": {"type": "object", "description": "Optional metadata for the conversation"}
                }
            }
        ),
        Tool(
            name="add_message",
            description="Add a message to the current conversation",
            inputSchema={
                "type": "object",
                "properties": {
                    "conversation_id": {"type": "string", "description": "ID of the conversation"},
                    "role": {"type": "string", "enum": ["user", "assistant", "system"]},
                    "content": {"type": "string", "description": "Message content"},
                    "metadata": {"type": "object", "description": "Optional message metadata"}
                },
                "required": ["conversation_id", "role", "content"]
            }
        ),
        Tool(
            name="get_conversation",
            description="Retrieve a full conversation with all messages",
            inputSchema={
                "type": "object",
                "properties": {
                    "conversation_id": {"type": "string", "description": "ID of the conversation to retrieve"}
                },
                "required": ["conversation_id"]
            }
        ),
        Tool(
            name="list_conversations",
            description="List recent conversations",
            inputSchema={
                "type": "object",
                "properties": {
                    "limit": {"type": "integer", "default": 20, "description": "Number of conversations to return"}
                }
            }
        ),
        Tool(
            name="search_conversations",
            description="Search conversations by content or title",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"}
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="set_session_context",
            description="Store context information for the session",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Context key"},
                    "value": {"description": "Context value (any type)"}
                },
                "required": ["key", "value"]
            }
        ),
        Tool(
            name="get_session_context",
            description="Retrieve stored session context",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {"type": "string", "description": "Context key to retrieve"}
                },
                "required": ["key"]
            }
        )
    ]


@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> List[TextContent]:
    """Handle tool calls for session persistence"""

    if name == "create_conversation":
        conversation_id = persistence.create_conversation(
            title=arguments.get("title"),
            metadata=arguments.get("metadata")
        )
        return [TextContent(type="text", text=f"Created conversation: {conversation_id}")]

    elif name == "add_message":
        message_id = persistence.add_message(
            conversation_id=arguments["conversation_id"],
            role=arguments["role"],
            content=arguments["content"],
            metadata=arguments.get("metadata")
        )
        return [TextContent(type="text", text=f"Added message: {message_id}")]

    elif name == "get_conversation":
        conversation = persistence.get_conversation(arguments["conversation_id"])
        if conversation:
            # Format conversation for display
            result = f"Conversation: {conversation.title}\n"
            result += f"Created: {conversation.created_at}\n"
            result += f"Updated: {conversation.updated_at}\n\n"

            if conversation.messages:
                for msg in conversation.messages:
                    result += f"[{msg.timestamp}] {msg.role}: {msg.content}\n\n"
            else:
                result += "No messages in this conversation.\n"

            return [TextContent(type="text", text=result)]
        else:
            return [TextContent(type="text", text="Conversation not found")]

    elif name == "list_conversations":
        conversations = persistence.list_conversations(arguments.get("limit", 20))
        if conversations:
            result = "Recent Conversations:\n\n"
            for conv in conversations:
                result += f"• {conv.title} (ID: {conv.id})\n"
                result += f"  Updated: {conv.updated_at}\n\n"
            return [TextContent(type="text", text=result)]
        else:
            return [TextContent(type="text", text="No conversations found")]

    elif name == "search_conversations":
        conversations = persistence.search_conversations(arguments["query"])
        if conversations:
            result = f"Search results for '{arguments['query']}':\n\n"
            for conv in conversations:
                result += f"• {conv.title} (ID: {conv.id})\n"
                result += f"  Updated: {conv.updated_at}\n\n"
            return [TextContent(type="text", text=result)]
        else:
            return [TextContent(type="text", text="No conversations found matching the query")]

    elif name == "set_session_context":
        persistence.set_session_state(arguments["key"], arguments["value"])
        return [TextContent(type="text", text=f"Stored session context: {arguments['key']}")]

    elif name == "get_session_context":
        value = persistence.get_session_state(arguments["key"])
        if value is not None:
            return [TextContent(type="text", text=f"Context '{arguments['key']}': {json.dumps(value, indent=2)}")]
        else:
            return [TextContent(type="text", text=f"No context found for key: {arguments['key']}")]

    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


async def main():
    # Run the server using stdio
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="claude-session-persistence",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={}
                )
            )
        )


if __name__ == "__main__":
    asyncio.run(main())