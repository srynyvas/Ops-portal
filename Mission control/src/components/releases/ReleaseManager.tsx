  // Node management functions
  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeById = (nodes, id, updates) => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return { ...node, children: updateNodeById(node.children, id, updates) };
      }
      return node;
    });
  };

  const removeNodeById = (nodes, id) => {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) {
        node.children = removeNodeById(node.children, id);
      }
      return true;
    });
  };

  const addNodeToParent = (nodes, parentId, newNode) => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
          expanded: true
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addNodeToParent(node.children, parentId, newNode)
        };
      }
      return node;
    });
  };

  const countTotalChildren = (node) => {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((count, child) => count + 1 + countTotalChildren(child), 0);
  };

  // Editor functions
  const handleDragStart = (e, node) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
    setDropTarget(null);
  };

  const handleDragOver = (e, node) => {
    e.preventDefault();
    if (draggedNode && draggedNode.id !== node.id && node.type !== 'task') {
      setDropTarget(node.id);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e, targetNode) => {
    e.preventDefault();
    if (!draggedNode || draggedNode.id === targetNode.id || targetNode.type === 'task') return;

    let newNodes = removeNodeById(currentRelease.nodes, draggedNode.id);
    newNodes = addNodeToParent(newNodes, targetNode.id, draggedNode);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: newNodes,
      updatedAt: new Date().toISOString()
    }));
    
    setDraggedNode(null);
    setDropTarget(null);
  };

  const toggleExpanded = (nodeId) => {
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, { 
        expanded: !findNodeById(prev.nodes, nodeId).expanded 
      }),
      updatedAt: new Date().toISOString()
    }));
  };

  const startEditing = (node) => {
    if (currentRelease.status === 'closed') return;
    setEditingNode(node.id);
    setEditValue(node.title);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: updateNodeById(prev.nodes, editingNode, { title: editValue.trim() }),
        updatedAt: new Date().toISOString()
      }));
    }
    setEditingNode(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingNode(null);
    setEditValue('');
  };

  const addNewNode = (parentId) => {
    if (currentRelease.status === 'closed') return;
    
    const parent = findNodeById(currentRelease.nodes, parentId);
    let newNodeType, newColor, newIcon;
    
    if (parent?.type === 'release') {
      newNodeType = 'feature';
      newColor = 'bg-blue-600';
      newIcon = 'Package';
    } else if (parent?.type === 'feature') {
      newNodeType = 'task';
      newColor = 'bg-gray-500';
      newIcon = 'Code';
    } else {
      return; // Can't add children to tasks
    }
    
    const newNode = {
      id: Date.now().toString(),
      title: newNodeType === 'feature' ? 'New Feature' : 'New Task',
      type: newNodeType,
      color: newColor,
      icon: newIcon,
      properties: {
        version: '', assignee: '', targetDate: '', environment: 'development',
        description: '', tags: [], priority: 'medium', status: 'planning',
        storyPoints: '', dependencies: [], notes: '', releaseNotes: ''
      },
      children: []
    };
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: addNodeToParent(prev.nodes, parentId, newNode),
      updatedAt: new Date().toISOString()
    }));
  };

  const confirmDelete = (nodeId) => {
    if (currentRelease.status === 'closed') return;
    
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (!node) return;

    const childCount = countTotalChildren(node);
    setDeleteConfirm({ nodeId, node, childCount });
  };

  const executeDelete = () => {
    if (deleteConfirm) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: removeNodeById(prev.nodes, deleteConfirm.nodeId),
        updatedAt: new Date().toISOString()
      }));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };