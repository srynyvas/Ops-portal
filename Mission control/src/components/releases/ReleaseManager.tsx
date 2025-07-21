// [Previous content preserved...]

  // Event handlers
  const handleNodeUpdate = (id: string, updates: Partial<ReleaseNode>) => {
    const updatedNodes = updateNode(currentRelease.nodes, id, updates);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleAddChild = (parentId: string, type: 'feature' | 'task') => {
    const newNode: ReleaseNode = {
      id: Date.now().toString(),
      title: type === 'feature' ? 'New Feature' : 'New Task',
      type,
      color: defaultColors[Math.floor(Math.random() * defaultColors.length)],
      icon: defaultIcons[Math.floor(Math.random() * defaultIcons.length)],
      expanded: true,
      properties: {
        assignee: '',
        targetDate: '',
        description: '',
        tags: [],
        priority: 'medium',
        status: 'planning',
        storyPoints: '',
        dependencies: [],
        notes: ''
      },
      children: []
    };
    
    const updatedNodes = addChildNode(currentRelease.nodes, parentId, newNode);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDeleteNode = (node: ReleaseNode) => {
    const childCount = countChildNodes(node);
    setDeleteConfirm({ node, childCount });
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;
    
    const updatedNodes = deleteNode(currentRelease.nodes, deleteConfirm.node.id);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
      updatedAt: new Date().toISOString()
    }));
    
    setDeleteConfirm(null);
    setSelectedNode(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Drag and drop handlers
  const handleDragStart = (node: ReleaseNode) => {
    if (currentRelease.status === 'closed') return;
    setDraggedNode(node);
    dragCounter.current = 0;
  };

  const handleDragEnter = (targetId: string) => {
    dragCounter.current++;
    setDragTarget(targetId);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragTarget(null);
    }
  };

  const handleDrop = (targetId: string) => {
    if (!draggedNode || draggedNode.id === targetId) return;
    
    const targetNode = findNodeById(currentRelease.nodes, targetId);
    if (!targetNode || targetNode.type === 'task') return;
    
    const updatedNodes = moveNode(currentRelease.nodes, draggedNode.id, targetId);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
      updatedAt: new Date().toISOString()
    }));
    
    setDraggedNode(null);
    setDragTarget(null);
    dragCounter.current = 0;
  };

  // Initialize with sample data
  useEffect(() => {
    const sampleReleases: Release[] = [
      {
        id: '1',
        name: 'User Authentication System',
        version: '2.1.0',
        description: 'Complete overhaul of the authentication system with OAuth2 integration',
        category: 'security',
        tags: ['oauth', 'security', 'backend'],
        targetDate: '2024-02-15',
        environment: 'production',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        progress: { completed: 7, total: 12, percentage: 58 },
        nodes: [
          {
            id: '1-1',
            title: 'Authentication Core v2.1.0',
            type: 'release',
            color: 'bg-purple-600',
            icon: 'Rocket',
            expanded: true,
            position: { x: 100, y: 100 },
            properties: {
              version: '2.1.0',
              assignee: 'Sarah Johnson',
              targetDate: '2024-02-15',
              environment: 'production',
              description: 'Core authentication system release',
              tags: ['oauth', 'security'],
              priority: 'high',
              status: 'in-progress',
              storyPoints: '89',
              dependencies: [],
              releaseNotes: 'Major authentication improvements with OAuth2 support'
            },
            children: [
              {
                id: '1-1-1',
                title: 'OAuth2 Integration',
                type: 'feature',
                color: 'bg-blue-600',
                icon: 'Package',
                expanded: true,
                position: { x: 480, y: 80 },
                properties: {
                  assignee: 'Mike Chen',
                  targetDate: '2024-02-01',
                  description: 'Implement OAuth2 authentication flow',
                  tags: ['oauth', 'integration'],
                  priority: 'high',
                  status: 'completed',
                  storyPoints: '21',
                  dependencies: [],
                  notes: 'Completed ahead of schedule'
                },
                children: [
                  {
                    id: '1-1-1-1',
                    title: 'OAuth2 Provider Setup',
                    type: 'task',
                    color: 'bg-green-600',
                    icon: 'CheckSquare',
                    expanded: false,
                    position: { x: 860, y: 60 },
                    properties: {
                      assignee: 'Mike Chen',
                      targetDate: '2024-01-25',
                      description: 'Configure OAuth2 providers (Google, GitHub)',
                      tags: ['oauth', 'setup'],
                      priority: 'medium',
                      status: 'completed',
                      storyPoints: '8',
                      dependencies: [],
                      notes: 'Google and GitHub providers configured'
                    },
                    children: []
                  },
                  {
                    id: '1-1-1-2',
                    title: 'Token Management',
                    type: 'task',
                    color: 'bg-yellow-600',
                    icon: 'CheckSquare',
                    expanded: false,
                    position: { x: 860, y: 220 },
                    properties: {
                      assignee: 'Alex Rivera',
                      targetDate: '2024-01-30',
                      description: 'Implement JWT token generation and validation',
                      tags: ['jwt', 'tokens'],
                      priority: 'high',
                      status: 'completed',
                      storyPoints: '13',
                      dependencies: ['1-1-1-1'],
                      notes: 'Includes refresh token mechanism'
                    },
                    children: []
                  }
                ]
              },
              {
                id: '1-1-2',
                title: 'Security Enhancements',
                type: 'feature',
                color: 'bg-red-600',
                icon: 'Package',
                expanded: false,
                position: { x: 480, y: 300 },
                properties: {
                  assignee: 'David Park',
                  targetDate: '2024-02-10',
                  description: 'Additional security measures and rate limiting',
                  tags: ['security', 'rate-limiting'],
                  priority: 'high',
                  status: 'in-progress',
                  storyPoints: '34',
                  dependencies: ['1-1-1'],
                  notes: 'Rate limiting implementation in progress'
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Mobile App v3.0',
        version: '3.0.0',
        description: 'Major mobile application redesign with new features',
        category: 'mobile',
        tags: ['mobile', 'ui', 'redesign'],
        targetDate: '2024-03-01',
        environment: 'staging',
        status: 'active',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-18T14:20:00Z',
        progress: { completed: 3, total: 8, percentage: 38 },
        nodes: []
      },
      {
        id: '3',
        name: 'Legacy System Migration',
        version: '1.5.0',
        description: 'Migration of legacy systems to new infrastructure',
        category: 'infrastructure',
        tags: ['migration', 'legacy', 'infrastructure'],
        status: 'closed',
        createdAt: '2023-12-01T08:00:00Z',
        updatedAt: '2024-01-05T16:00:00Z',
        closedAt: '2024-01-05T16:00:00Z',
        closeReason: 'Successfully deployed to production',
        progress: { completed: 15, total: 15, percentage: 100 },
        statusHistory: [
          { status: 'active', timestamp: '2023-12-01T08:00:00Z' },
          { status: 'closed', timestamp: '2024-01-05T16:00:00Z', reason: 'Successfully deployed to production' }
        ],
        nodes: []
      }
    ];
    
    setReleases(sampleReleases);
  }, []);