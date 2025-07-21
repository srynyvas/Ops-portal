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

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Version (for releases) */}
              {node.type === 'release' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Package size={16} className="mr-2" />
                    Version
                  </label>
                  <input
                    type="text"
                    value={node.properties.version}
                    onChange={(e) => updateNodeProperties(node.id, { version: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 1.0.0"
                  />
                </div>
              )}

              {/* Assignee */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2" />
                  Assignee
                </label>
                <input
                  type="text"
                  value={node.properties.assignee}
                  onChange={(e) => updateNodeProperties(node.id, { assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter assignee name or team"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="mr-2" />
                  Description
                </label>
                <textarea
                  value={node.properties.description}
                  onChange={(e) => updateNodeProperties(node.id, { description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              {/* Priority, Status, Story Points */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={node.properties.priority}
                    onChange={(e) => updateNodeProperties(node.id, { priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={node.properties.status}
                    onChange={(e) => updateNodeProperties(node.id, { status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-development">In Development</option>
                    <option value="testing">Testing</option>
                    <option value="ready-for-release">Ready for Release</option>
                    <option value="released">Released</option>
                    <option value="blocked">Blocked</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Points</label>
                  <input
                    type="number"
                    value={node.properties.storyPoints}
                    onChange={(e) => updateNodeProperties(node.id, { storyPoints: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              {/* Target Date and Environment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="mr-2" />
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={node.properties.targetDate}
                    onChange={(e) => updateNodeProperties(node.id, { targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <select
                    value={node.properties.environment}
                    onChange={(e) => updateNodeProperties(node.id, { environment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {environments.map(env => (
                      <option key={env.id} value={env.id}>
                        {env.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} className="mr-2" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {node.properties.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(node.id, tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        addTag(node.id, newTag);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add tag and press Enter"
                  />
                </div>
              </div>

              {/* Dependencies */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <GitBranch size={16} className="mr-2" />
                  Dependencies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {node.properties.dependencies.map((dep, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                    >
                      {dep}
                      <button
                        onClick={() => removeDependency(node.id, dep)}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDependency}
                    onChange={(e) => setNewDependency(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newDependency.trim()) {
                        addDependency(node.id, newDependency);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add dependency and press Enter"
                  />
                </div>
              </div>

              {/* Release Notes */}
              {node.type === 'release' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="mr-2" />
                    Release Notes
                  </label>
                  <textarea
                    value={node.properties.releaseNotes}
                    onChange={(e) => updateNodeProperties(node.id, { releaseNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    placeholder="What's new in this release?"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="mr-2" />
                  Notes
                </label>
                <textarea
                  value={node.properties.notes}
                  onChange={(e) => updateNodeProperties(node.id, { notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Additional notes and comments"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };