        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Save Release</h3>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setFormErrors({});
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Name</label>
                  <input
                    type="text"
                    value={saveFormData.name}
                    onChange={(e) => {
                      setSaveFormData(prev => ({ ...prev, name: e.target.value }));
                      if (formErrors.name) {
                        setFormErrors(prev => ({ ...prev, name: '' }));
                      }
                    }}
                    placeholder="Enter release name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={saveFormData.version}
                    onChange={(e) => {
                      setSaveFormData(prev => ({ ...prev, version: e.target.value }));
                      if (formErrors.version) {
                        setFormErrors(prev => ({ ...prev, version: '' }));
                      }
                    }}
                    placeholder="e.g., 1.0.0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.version ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.version && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.version}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={saveFormData.description}
                    onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this release"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={saveFormData.category}
                      onChange={(e) => setSaveFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                    <select
                      value={saveFormData.environment}
                      onChange={(e) => setSaveFormData(prev => ({ ...prev, environment: e.target.value }))}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={saveFormData.targetDate}
                    onChange={(e) => {
                      setSaveFormData(prev => ({ ...prev, targetDate: e.target.value }));
                      if (formErrors.targetDate) {
                        setFormErrors(prev => ({ ...prev, targetDate: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.targetDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.targetDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.targetDate}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveCurrentRelease}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Save Release
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setFormErrors({});
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Close Dialog */}
        {showCloseDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Close Release</h3>
                <button
                  onClick={() => {
                    setShowCloseDialog(false);
                    setSelectedReleaseId(null);
                    setCloseReason('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-4">
                  This release will be closed and no longer editable. You can reopen it later if needed.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for closing <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    placeholder="e.g., Release deployed to production, Project cancelled, Moving to next version..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeRelease}
                  disabled={!closeReason.trim()}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Close Release
                </button>
                <button
                  onClick={() => {
                    setShowCloseDialog(false);
                    setSelectedReleaseId(null);
                    setCloseReason('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reopen Dialog */}
        {showReopenDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Reopen Release</h3>
                <button
                  onClick={() => {
                    setShowReopenDialog(false);
                    setSelectedReleaseId(null);
                    setReopenReason('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-4">
                  This release is currently closed. To reopen and enable editing, please provide a reason.
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for reopening <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder="e.g., Need to add hotfix, Found additional requirements, Continuing development..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reopenRelease}
                  disabled={!reopenReason.trim()}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Reopen Release
                </button>
                <button
                  onClick={() => {
                    setShowReopenDialog(false);
                    setSelectedReleaseId(null);
                    setReopenReason('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Editor view
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Editor Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => setCurrentView('catalogue')}
            className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Catalogue</span>
          </button>
          
          {currentRelease.status !== 'closed' && (
            <button
              onClick={() => {
                setSaveFormData({
                  name: currentRelease.name,
                  version: currentRelease.version || '1.0.0',
                  description: currentRelease.description,
                  category: currentRelease.category,
                  tags: currentRelease.tags,
                  targetDate: currentRelease.targetDate || '',
                  environment: currentRelease.environment || 'development'
                });
                setShowSaveDialog(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save size={16} />
              <span className="text-sm font-medium">Save Release</span>
            </button>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {currentRelease.name}
          {currentRelease.version && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
              v{currentRelease.version}
            </span>
          )}
          {currentRelease.status === 'closed' && (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
              🔒 Read Only
            </span>
          )}
        </h1>
        {currentRelease.description && (
          <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
            {currentRelease.description}
          </p>
        )}
        
        {currentRelease.status === 'closed' && (
          <p className="text-sm text-red-600 bg-red-50 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
            <strong>⚠️ This release is closed:</strong> All editing functions are disabled. Return to the catalogue to reopen if needed.
          </p>
        )}
      </div>

      {/* Release Canvas */}
      <div className="relative w-full h-full overflow-auto">
        <div className="absolute inset-0" style={{ minWidth: '3000px', minHeight: '2000px' }}>
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {currentRelease.nodes.map(node => renderConnections(node, 0, 300, 600))}
          </svg>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {currentRelease.nodes.map(node => renderNode(node, 0, 300, 600))}
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {renderCustomizationPanel()}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete "<strong>{deleteConfirm.node.title}</strong>"?
              </p>
              {deleteConfirm.childCount > 0 && (
                <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  ⚠️ This will also delete {deleteConfirm.childCount} child {deleteConfirm.childCount === 1 ? 'item' : 'items'}.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={executeDelete}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog in Editor */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Save Release</h3>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setFormErrors({});
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Release Name</label>
                <input
                  type="text"
                  value={saveFormData.name}
                  onChange={(e) => {
                    setSaveFormData(prev => ({ ...prev, name: e.target.value }));
                    if (formErrors.name) {
                      setFormErrors(prev => ({ ...prev, name: '' }));
                    }
                  }}
                  placeholder="Enter release name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={saveFormData.version}
                  onChange={(e) => {
                    setSaveFormData(prev => ({ ...prev, version: e.target.value }));
                    if (formErrors.version) {
                      setFormErrors(prev => ({ ...prev, version: '' }));
                    }
                  }}
                  placeholder="e.g., 1.0.0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.version ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.version && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.version}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={saveFormData.description}
                  onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this release"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={saveFormData.category}
                    onChange={(e) => setSaveFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                  <select
                    value={saveFormData.environment}
                    onChange={(e) => setSaveFormData(prev => ({ ...prev, environment: e.target.value }))}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={saveFormData.targetDate}
                  onChange={(e) => {
                    setSaveFormData(prev => ({ ...prev, targetDate: e.target.value }));
                    if (formErrors.targetDate) {
                      setFormErrors(prev => ({ ...prev, targetDate: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.targetDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.targetDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.targetDate}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveCurrentRelease}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Save Release
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setFormErrors({});
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag Indicator */}
      {draggedNode && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
          <p className="text-sm font-medium">
            Dragging: <span className="font-bold">{draggedNode.title}</span>
          </p>
          <p className="text-xs opacity-75">Drop on a release or feature</p>
        </div>
      )}

      {/* Empty State */}
      {currentRelease.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No items left!</h2>
            <p className="text-gray-500 mb-4">Add a release to get started</p>
            <button
              onClick={() => setCurrentRelease(prev => ({
                ...prev,
                nodes: [{
                  id: Date.now().toString(),
                  title: 'Release v1.0.0',
                  type: 'release',
                  color: 'bg-purple-600',
                  icon: 'Rocket',
                  expanded: true,
                  properties: {
                    version: '1.0.0', assignee: '', targetDate: '', environment: 'development',
                    description: '', tags: [], priority: 'medium', status: 'planning',
                    storyPoints: '', dependencies: [], notes: '', releaseNotes: ''
                  },
                  children: []
                }],
                updatedAt: new Date().toISOString()
              }))}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Create New Release
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseManager;