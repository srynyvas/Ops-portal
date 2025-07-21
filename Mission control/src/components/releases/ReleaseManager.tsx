  // Render functions - Release card for grid view
  const renderReleaseCard = (release: Release) => (
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
              className={`h-2 rounded-full transition-all ${release.status === 'closed' ? 'bg-gray-400' : 'bg-purple-600'}`}
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
              {release.preview?.centralNode || 'No content'}
            </div>
            {release.preview?.branches && release.preview.branches.length > 0 && (
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
            <span>{release.nodeCount || 0} items</span>
            <span>{new Date(release.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render functions - Release list for list view  
  const renderReleaseList = (release: Release) => (
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
              {release.nodeCount || 0} items
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
            {release.tags.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{release.tags.length - 5}
              </span>
            )}
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
  );
