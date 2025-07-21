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