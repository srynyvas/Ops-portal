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

  // Customization Panel Render Function
  const renderCustomizationPanel = () => {
    if (!customizingNode) return null;
    const node = findNodeById(currentRelease.nodes, customizingNode);
    if (!node) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Customize {node.type === 'release' ? 'Release' : node.type === 'feature' ? 'Feature' : 'Task'}: {node.title}
            </h3>
            <button
              onClick={() => {
                setCustomizingNode(null); 
                setActiveTab('visual');
                setNewTag('');
                setNewDependency('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {setActiveTab('visual'); setNewTag(''); setNewDependency('');}}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'visual' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Palette size={16} className="inline mr-2" />
              Visual
            </button>
            <button
              onClick={() => {setActiveTab('properties'); setNewTag(''); setNewDependency('');}}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'properties' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Info size={16} className="inline mr-2" />
              Properties
            </button>
          </div>

          {/* Visual Tab */}
          {activeTab === 'visual' && (
            <div>
              {/* Color Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-8 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform ${
                        node.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                      }`}
                      onClick={() => updateNodeStyle(node.id, { color })}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                  {Object.entries(releaseIcons).map(([name, IconComponent]) => (
                    <button
                      key={name}
                      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        node.icon === name ? 'bg-purple-100 ring-2 ring-purple-300' : ''
                      }`}
                      onClick={() => updateNodeStyle(node.id, { icon: name })}
                    >
                      <IconComponent size={20} className="text-gray-600" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Node Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="flex gap-2">
                  {['release', 'feature', 'task'].map(type => (
                    <button
                      key={type}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        node.type === type 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => updateNodeStyle(node.id, { type })}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };