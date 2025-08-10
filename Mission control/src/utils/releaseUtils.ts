/**
 * Release Management Utility Functions
 * Provides tree manipulation and calculation utilities
 */

import { ReleaseNode, PreviewData } from '../types/release.types';

/**
 * Recursively find a node by ID in the tree structure
 */
export const findNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Update a specific node while maintaining tree structure
 */
export const updateNodeById = (
  nodes: ReleaseNode[],
  id: string,
  updates: Partial<ReleaseNode>
): ReleaseNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNodeById(node.children, id, updates)
      };
    }
    return node;
  });
};

/**
 * Remove a node and all its children from the tree
 */
export const removeNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children ? removeNodeById(node.children, id) : []
    }));
};

/**
 * Add a new node as a child to a specified parent
 */
export const addNodeToParent = (
  nodes: ReleaseNode[],
  parentId: string,
  newNode: ReleaseNode
): ReleaseNode[] => {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), newNode],
        expanded: true
      };
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: addNodeToParent(node.children, parentId, newNode)
      };
    }
    return node;
  });
};

/**
 * Move a node from one parent to another
 */
export const moveNode = (
  nodes: ReleaseNode[],
  nodeId: string,
  newParentId: string
): ReleaseNode[] => {
  // Find the node to move
  const nodeToMove = findNodeById(nodes, nodeId);
  if (!nodeToMove) return nodes;

  // Check if the new parent is a descendant of the node to move (prevent circular)
  if (isDescendant(nodeToMove, newParentId)) {
    console.error('Cannot move node to its own descendant');
    return nodes;
  }

  // Remove the node from its current position
  let updatedNodes = removeNodeById(nodes, nodeId);
  
  // Add it to the new parent
  updatedNodes = addNodeToParent(updatedNodes, newParentId, nodeToMove);
  
  return updatedNodes;
};

/**
 * Check if a node is a descendant of another node
 */
export const isDescendant = (node: ReleaseNode, descendantId: string): boolean => {
  if (node.children) {
    for (const child of node.children) {
      if (child.id === descendantId) return true;
      if (isDescendant(child, descendantId)) return true;
    }
  }
  return false;
};

/**
 * Count all nodes in the tree recursively
 */
export const countTotalNodes = (nodes: ReleaseNode[]): number => {
  let count = nodes.length;
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      count += countTotalNodes(node.children);
    }
  });
  return count;
};

/**
 * Count all descendants of a specific node
 */
export const countTotalChildren = (node: ReleaseNode): number => {
  if (!node.children || node.children.length === 0) return 0;
  
  let count = node.children.length;
  node.children.forEach(child => {
    count += countTotalChildren(child);
  });
  return count;
};

/**
 * Calculate completion percentage based on task status
 */
export const calculateCompletion = (nodes: ReleaseNode[]): number => {
  let totalTasks = 0;
  let completedTasks = 0;

  const countTasks = (nodeList: ReleaseNode[]) => {
    nodeList.forEach(node => {
      if (node.type === 'task') {
        totalTasks++;
        if (['released', 'ready-for-release'].includes(node.properties.status)) {
          completedTasks++;
        }
      }
      if (node.children && node.children.length > 0) {
        countTasks(node.children);
      }
    });
  };

  countTasks(nodes);
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};

/**
 * Generate preview data for catalogue cards
 */
export const generatePreview = (nodes: ReleaseNode[]): PreviewData => {
  const centralNode = nodes[0]?.title || 'Empty Release';
  const branches: string[] = [];

  // Get up to 3 feature names for preview
  nodes.forEach(node => {
    if (node.type === 'release' && node.children) {
      node.children.slice(0, 3).forEach(feature => {
        if (feature.type === 'feature') {
          branches.push(feature.title);
        }
      });
    }
  });

  return { centralNode, branches };
};

/**
 * Increment version number for duplication
 */
export const incrementVersion = (version: string): string => {
  const parts = version.split('.');
  if (parts.length !== 3) return version;

  const patch = parseInt(parts[2], 10);
  if (isNaN(patch)) return version;

  parts[2] = (patch + 1).toString();
  return parts.join('.');
};

/**
 * Validate version format
 */
export const isValidVersion = (version: string): boolean => {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return versionRegex.test(version);
};

/**
 * Get node depth in the tree
 */
export const getNodeDepth = (nodes: ReleaseNode[], nodeId: string, depth = 0): number => {
  for (const node of nodes) {
    if (node.id === nodeId) return depth;
    if (node.children && node.children.length > 0) {
      const childDepth = getNodeDepth(node.children, nodeId, depth + 1);
      if (childDepth > -1) return childDepth;
    }
  }
  return -1;
};

/**
 * Get all node IDs in the tree
 */
export const getAllNodeIds = (nodes: ReleaseNode[]): string[] => {
  let ids: string[] = [];
  
  nodes.forEach(node => {
    ids.push(node.id);
    if (node.children && node.children.length > 0) {
      ids = ids.concat(getAllNodeIds(node.children));
    }
  });
  
  return ids;
};

/**
 * Find parent of a node
 */
export const findParentNode = (
  nodes: ReleaseNode[],
  childId: string,
  parent: ReleaseNode | null = null
): ReleaseNode | null => {
  for (const node of nodes) {
    if (node.children && node.children.some(child => child.id === childId)) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findParentNode(node.children, childId, node);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Calculate node position in visual canvas
 */
export const calculateNodePosition = (
  node: ReleaseNode,
  level: number,
  index: number,
  parentX = 0,
  parentY = 0
): { x: number; y: number } => {
  const horizontalSpacing = 300;
  const verticalSpacing = 200;
  
  const x = parentX + (level > 0 ? horizontalSpacing : 0);
  const y = parentY + (index * verticalSpacing);
  
  return { x, y };
};

/**
 * Generate unique node ID
 */
export const generateNodeId = (): string => {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clone a node with new IDs
 */
export const cloneNode = (node: ReleaseNode): ReleaseNode => {
  const cloned: ReleaseNode = {
    ...node,
    id: generateNodeId(),
    children: node.children ? node.children.map(child => cloneNode(child)) : []
  };
  return cloned;
};

/**
 * Flatten tree to array for easier searching
 */
export const flattenTree = (nodes: ReleaseNode[]): ReleaseNode[] => {
  let flat: ReleaseNode[] = [];
  
  nodes.forEach(node => {
    flat.push(node);
    if (node.children && node.children.length > 0) {
      flat = flat.concat(flattenTree(node.children));
    }
  });
  
  return flat;
};

/**
 * Search nodes by query
 */
export const searchNodes = (nodes: ReleaseNode[], query: string): ReleaseNode[] => {
  const lowercaseQuery = query.toLowerCase();
  const flatNodes = flattenTree(nodes);
  
  return flatNodes.filter(node => {
    return (
      node.title.toLowerCase().includes(lowercaseQuery) ||
      node.properties.description.toLowerCase().includes(lowercaseQuery) ||
      node.properties.assignee.toLowerCase().includes(lowercaseQuery) ||
      node.properties.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  });
};

/**
 * Validate node drop target
 */
export const isValidDropTarget = (
  draggedNode: ReleaseNode,
  targetNode: ReleaseNode
): boolean => {
  // Tasks cannot have children
  if (targetNode.type === 'task') return false;
  
  // Features can only be dropped on releases
  if (draggedNode.type === 'feature' && targetNode.type !== 'release') return false;
  
  // Tasks can only be dropped on features
  if (draggedNode.type === 'task' && targetNode.type !== 'feature') return false;
  
  // Releases cannot be dropped anywhere
  if (draggedNode.type === 'release') return false;
  
  // Prevent dropping on self or descendants
  if (draggedNode.id === targetNode.id) return false;
  if (isDescendant(draggedNode, targetNode.id)) return false;
  
  return true;
};