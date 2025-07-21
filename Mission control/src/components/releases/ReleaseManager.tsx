  // Release management functions
  const saveCurrentRelease = () => {
    const errors = validateReleaseForm(saveFormData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});

    const releaseToSave = {
      ...currentRelease,
      ...saveFormData,
      id: currentRelease.id || `release-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      nodeCount: countTotalNodes(currentRelease.nodes),
      completion: calculateCompletion(currentRelease.nodes),
      preview: generatePreview(currentRelease.nodes),
      status: currentRelease.status || 'active',
      statusHistory: currentRelease.statusHistory || []
    };

    if (currentRelease.id) {
      // Update existing
      setSavedReleases(prev => 
        prev.map(r => r.id === currentRelease.id ? releaseToSave : r)
      );
    } else {
      // Create new
      releaseToSave.createdAt = new Date().toISOString();
      setSavedReleases(prev => [...prev, releaseToSave]);
    }

    setCurrentRelease(releaseToSave);
    setShowSaveDialog(false);
    setSaveFormData({ 
      name: '', 
      version: '', 
      description: '', 
      category: 'minor', 
      tags: [], 
      targetDate: '', 
      environment: 'development' 
    });
  };

  const loadRelease = (release) => {
    // Only allow loading if release is active
    if (release.status === 'closed') {
      setSelectedReleaseId(release.id);
      setShowReopenDialog(true);
      return;
    }
    
    setCurrentRelease({
      ...release,
      updatedAt: new Date().toISOString()
    });
    setCurrentView('editor');
  };

  const closeRelease = () => {
    if (!selectedReleaseId || !closeReason.trim()) return;
    
    setSavedReleases(prev => 
      prev.map(r => r.id === selectedReleaseId ? {
        ...r,
        status: 'closed',
        statusHistory: [
          ...r.statusHistory,
          {
            action: 'closed',
            reason: closeReason.trim(),
            timestamp: new Date().toISOString(),
            user: 'User'
          }
        ],
        updatedAt: new Date().toISOString()
      } : r)
    );
    
    setShowCloseDialog(false);
    setSelectedReleaseId(null);
    setCloseReason('');
  };

  const reopenRelease = () => {
    if (!selectedReleaseId || !reopenReason.trim()) return;
    
    const release = savedReleases.find(r => r.id === selectedReleaseId);
    if (!release) return;
    
    const updatedRelease = {
      ...release,
      status: 'active',
      statusHistory: [
        ...release.statusHistory,
        {
          action: 'reopened',
          reason: reopenReason.trim(),
          timestamp: new Date().toISOString(),
          user: 'User'
        }
      ],
      updatedAt: new Date().toISOString()
    };
    
    setSavedReleases(prev => 
      prev.map(r => r.id === selectedReleaseId ? updatedRelease : r)
    );
    
    setCurrentRelease(updatedRelease);
    setCurrentView('editor');
    
    setShowReopenDialog(false);
    setSelectedReleaseId(null);
    setReopenReason('');
  };

  const createNewRelease = () => {
    const newReleaseId = Date.now().toString();
    setCurrentRelease({
      id: null,
      name: 'New Release',
      version: '1.0.0',
      description: '',
      category: 'minor',
      tags: [],
      targetDate: '',
      environment: 'development',
      status: 'active',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [{
        id: newReleaseId,
        title: 'Release v1.0.0',
        type: 'release',
        color: 'bg-purple-600',
        icon: 'Rocket',
        expanded: true,
        properties: {
          version: '1.0.0', 
          assignee: '', 
          targetDate: '', 
          environment: 'development',
          description: '', 
          tags: [], 
          priority: 'medium', 
          status: 'planning',
          storyPoints: '', 
          dependencies: [], 
          notes: '', 
          releaseNotes: ''
        },
        children: []
      }]
    });
    setCurrentView('editor');
  };

  const duplicateRelease = (release) => {
    const duplicate = {
      ...release,
      id: `release-${Date.now()}`,
      name: `${release.name} (Copy)`,
      version: incrementVersion(release.version),
      status: 'active',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedReleases(prev => [...prev, duplicate]);
  };

  const incrementVersion = (version) => {
    const parts = version.split('.');
    if (parts.length >= 3) {
      parts[2] = (parseInt(parts[2]) + 1).toString();
      return parts.join('.');
    }
    return version;
  };

  const countTotalNodes = (nodes) => {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? countTotalNodes(node.children) : 0);
    }, 0);
  };

  const calculateCompletion = (nodes) => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    const countTasks = (nodeList) => {
      nodeList.forEach(node => {
        if (node.type === 'task') {
          totalTasks++;
          if (node.properties.status === 'released' || 
              node.properties.status === 'completed' || 
              node.properties.status === 'ready-for-release') {
            completedTasks++;
          }
        } else if (node.type === 'feature') {
          // Features count too but have less weight
          totalTasks += 0.5;
          if (node.properties.status === 'released' || 
              node.properties.status === 'completed' || 
              node.properties.status === 'ready-for-release') {
            completedTasks += 0.5;
          }
        }
        if (node.children) {
          countTasks(node.children);
        }
      });
    };
    
    countTasks(nodes);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const generatePreview = (nodes) => {
    const centralNode = nodes.find(n => n.type === 'release');
    if (!centralNode) return { centralNode: 'Empty', branches: [] };
    
    return {
      centralNode: centralNode.title,
      branches: centralNode.children ? centralNode.children.map(c => c.title).slice(0, 4) : []
    };
  };

  // Filter releases
  const filteredReleases = savedReleases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });