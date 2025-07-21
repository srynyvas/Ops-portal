  // Render connections between nodes
  const renderConnections = (node, level = 0, parentX = 0, parentY = 0) => {
    if (!node.expanded || !node.children || node.children.length === 0) return null;

    return node.children.map((child, index) => {
      const childX = 320;
      const childY = (index - (node.children.length - 1) / 2) * 160;

      return (
        <g key={`connection-${child.id}`}>
          <line
            x1={parentX}
            y1={parentY}
            x2={parentX + childX}
            y2={parentY + childY}
            stroke="#e5e7eb"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          {renderConnections(child, level + 1, parentX + childX, parentY + childY)}
        </g>
      );
    });
  };

  // Render individual nodes with customization support
  const renderNode = (node, level = 0, offsetX = 0, offsetY = 0) => {
    const IconComponent = releaseIcons[node.icon] || Rocket;
    const isDropTarget = dropTarget === node.id;
    const isDragging = draggedNode?.id === node.id;
    const isEditing = editingNode === node.id;
    const hasProperties = node.properties.assignee || node.properties.targetDate || node.properties.description || node.properties.tags.length > 0;
    const isReadOnly = currentRelease.status === 'closed';
    
    const getNodeSize = () => {
      switch (node.type) {
        case 'release': return 'w-64 h-40';
        case 'feature': return 'w-52 h-32';
        case 'task': return 'w-44 h-28';
        default: return 'w-44 h-28';
      }
    };

    const getTextSize = () => {
      switch (node.type) {
        case 'release': return 'text-lg font-bold';
        case 'feature': return 'text-md font-semibold';
        case 'task': return 'text-sm font-medium';
        default: return 'text-sm';
      }
    };

    return (
      <div key={node.id} className="relative">
        <div
          className={`
            absolute transform -translate-x-1/2 -translate-y-1/2 ${getNodeSize()}
            ${node.color} text-white rounded-xl shadow-lg cursor-pointer
            transition-all duration-300 hover:scale-105 hover:shadow-xl
            ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
            ${isDropTarget ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
            ${isReadOnly ? 'cursor-default' : ''}
          `}
          style={{ left: offsetX, top: offsetY }}
          draggable={!isEditing && !isReadOnly}
          onDragStart={(e) => !isReadOnly && handleDragStart(e, node)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => !isReadOnly && handleDragOver(e, node)}
          onDrop={(e) => !isReadOnly && handleDrop(e, node)}
        >
          <div className="p-4 h-full flex flex-col justify-between">
            {/* Header with icon and controls */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <IconComponent size={node.type === 'release' ? 26 : 22} className="text-white/90" />
                {hasProperties && (
                  <div className="w-2 h-2 bg-yellow-300 rounded-full" title="Has additional properties" />
                )}
                {node.type === 'release' && node.properties.version && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    v{node.properties.version}
                  </span>
                )}
              </div>
              
              {!isReadOnly && (
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomizingNode(node.id);
                    }}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Customize"
                  >
                    <Settings size={12} />
                  </button>

                  {node.children && node.children.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(node.id);
                      }}
                      className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      title="Expand/Collapse"
                    >
                      {node.expanded ? <Minus size={12} /> : <Plus size={12} />}
                    </button>
                  )}
                  
                  {node.type !== 'task' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewNode(node.id);
                      }}
                      className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      title={`Add ${node.type === 'release' ? 'Feature' : 'Task'}`}
                    >
                      <Plus size={12} />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(node.id);
                    }}
                    className="w-6 h-6 bg-red-500/30 rounded-full flex items-center justify-center hover:bg-red-500/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Node Title - Editable */}
            <div className="flex-1 flex flex-col justify-center">
              {isEditing ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter title"
                    autoFocus
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      onClick={saveEdit}
                      className="w-5 h-5 bg-green-500/30 rounded flex items-center justify-center hover:bg-green-500/50"
                    >
                      <Check size={10} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-5 h-5 bg-red-500/30 rounded flex items-center justify-center hover:bg-red-500/50"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className={`group w-full ${!isReadOnly ? 'cursor-pointer' : ''}`}
                  onClick={() => !isReadOnly && startEditing(node)}
                >
                  <h3 className={`${getTextSize()} text-center text-white/95 leading-tight group-hover:text-white transition-colors mb-1`}>
                    {node.title}
                  </h3>
                  {!isReadOnly && (
                    <Edit3 size={10} className="mx-auto text-white/0 group-hover:text-white/70 transition-colors" />
                  )}
                </div>
              )}
            </div>

            {/* Property Indicators */}
            <div className="space-y-1">
              {/* Priority & Status */}
              <div className="flex gap-1 justify-center">
                {node.properties.priority && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[node.properties.priority]}`}>
                    {node.properties.priority}
                  </span>
                )}
                {node.properties.status && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[node.properties.status]}`}>
                    {node.properties.status}
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/70">
                {node.properties.assignee && (
                  <span className="flex items-center gap-1">
                    <User size={10} />
                    {node.properties.assignee.split(' ')[0]}
                  </span>
                )}
                {node.properties.storyPoints && (
                  <span className="flex items-center gap-1">
                    <Target size={10} />
                    {node.properties.storyPoints}
                  </span>
                )}
                {node.properties.targetDate && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(node.properties.targetDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Environment & Dependencies */}
              <div className="flex items-center justify-center gap-1 text-xs">
                {node.properties.environment && node.properties.environment !== 'development' && (
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    environments.find(e => e.id === node.properties.environment)?.color || 'bg-white/20 text-white'
                  }`}>
                    {environments.find(e => e.id === node.properties.environment)?.name.slice(0, 4) || node.properties.environment}
                  </span>
                )}
                {node.properties.dependencies.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded text-xs">
                    {node.properties.dependencies.length} dep{node.properties.dependencies.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Tags */}
              {node.properties.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {node.properties.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {node.properties.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      +{node.properties.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Children count */}
              {node.children && node.children.length > 0 && (
                <div className="text-center">
                  <span className="text-xs text-white/70">
                    {node.children.length} {node.type === 'release' ? 'feature' : 'task'}{node.children.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Child Nodes */}
        {node.expanded && node.children && node.children.map((child, index) => {
          const childOffsetX = offsetX + 320;
          const childOffsetY = offsetY + (index - (node.children.length - 1) / 2) * 160;
          
          return renderNode(child, level + 1, childOffsetX, childOffsetY);
        })}
      </div>
    );
  };