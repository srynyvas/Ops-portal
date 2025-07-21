  // Main render - Return the complete interface
  if (currentView === 'catalogue') {
    return (
      <div className="w-full h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Rocket size={28} className="text-purple-600" />
                Release Management
              </h1>
              <p className="text-gray-600 mt-1">Manage software releases, features, and tasks</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCatalogueView(catalogueView === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title={`Switch to ${catalogueView === 'grid' ? 'list' : 'grid'} view`}
              >
                {catalogueView === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
              
              <button
                onClick={createNewRelease}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus size={20} />
                New Release
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search releases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="px-6 py-6">
          {filteredReleases.length === 0 ? (
            <div className="text-center py-12">
              <Rocket size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No releases found' : 'No releases yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first release to get started'}
              </p>
              <button
                onClick={createNewRelease}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Create New Release
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredReleases.length} release{filteredReleases.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {catalogueView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReleases.map(release => (
                    <div key={release.id} className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg ${
                      release.status === 'closed' ? 'opacity-60 bg-gray-50' : ''
                    }`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-lg font-semibold ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-800'}`}>
                                {release.name}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                release.status === 'closed' ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-700'
                              }`}>
                                v{release.version}
                              </span>
                              {release.status === 'closed' && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                  Closed
                                </span>
                              )}
                            </div>
                            <p className={`text-sm line-clamp-2 ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
                              {release.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={() => loadRelease(release)}
                              className={`p-2 rounded-lg transition-colors ${
                                release.status === 'closed' 
                                  ? 'text-orange-600 hover:bg-orange-50' 
                                  : 'text-purple-600 hover:bg-purple-50'
                              }`}
                              title={release.status === 'closed' ? 'Reopen release' : 'Open release'}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => duplicateRelease(release)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Duplicate release"
                            >
                              <Copy size={16} />
                            </button>
                            {release.status !== 'closed' && (
                              <button
                                onClick={() => {
                                  setSelectedReleaseId(release.id);
                                  setShowCloseDialog(true);
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Close release"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress and Environment */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{release.completion || 0}% complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${release.status === 'closed' ? 'bg-gray-400' : 'bg-purple-600'}`}
                              style={{ width: `${release.completion || 0}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-600'
                            }`}>
                              {environments.find(e => e.id === release.environment)?.name || release.environment}
                            </span>
                            {release.targetDate && (
                              <span className="text-xs text-gray-500">
                                Target: {new Date(release.targetDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Preview */}
                        <div className={`rounded-lg p-3 mb-3 ${release.status === 'closed' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                          <div className="text-xs text-gray-600 mb-2">Features</div>
                          <div className="text-sm">
                            <div className={`font-medium mb-1 ${release.status === 'closed' ? 'text-gray-500' : 'text-purple-600'}`}>
                              {release.preview.centralNode}
                            </div>
                            {release.preview.branches.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {release.preview.branches.map((branch, index) => (
                                  <span key={index} className={`px-2 py-1 rounded text-xs ${
                                    release.status === 'closed' 
                                      ? 'bg-gray-200 text-gray-500' 
                                      : 'bg-white text-gray-600'
                                  }`}>
                                    {branch}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tags and metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex flex-wrap gap-1">
                            {release.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className={`px-2 py-1 rounded ${
                                release.status === 'closed' 
                                  ? 'bg-gray-200 text-gray-600' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {tag}
                              </span>
                            ))}
                            {release.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                +{release.tags.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span>{release.nodeCount} items</span>
                            <span>{new Date(release.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReleases.map(release => (
                    <div key={release.id} className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all ${
                      release.status === 'closed' ? 'opacity-60 bg-gray-50' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-lg font-semibold ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-800'}`}>
                              {release.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              release.status === 'closed' ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-700'
                            }`}>
                              v{release.version}
                            </span>
                            {release.status === 'closed' && (
                              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                Closed
                              </span>
                            )}
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {release.nodeCount} items
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-600'
                            }`}>
                              {environments.find(e => e.id === release.environment)?.name || release.environment}
                            </span>
                            <span className="text-xs text-gray-500">
                              {release.completion || 0}% complete
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(release.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
                            {release.description}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {release.tags.slice(0, 5).map((tag, index) => (
                              <span key={index} className={`px-2 py-1 text-xs rounded ${
                                release.status === 'closed' 
                                  ? 'bg-gray-200 text-gray-600' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadRelease(release)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${
                              release.status === 'closed' 
                                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                          >
                            {release.status === 'closed' ? 'Re-Open' : 'Open'}
                          </button>
                          <button
                            onClick={() => duplicateRelease(release)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={16} />
                          </button>
                          {release.status !== 'closed' && (
                            <button
                              onClick={() => {
                                setSelectedReleaseId(release.id);
                                setShowCloseDialog(true);
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                              title="Close release"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
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