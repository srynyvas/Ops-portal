import React from 'react';
import { clsx } from 'clsx';
import * as Icons from 'lucide-react';
import type { NavigationItem } from '../../types';

interface SidebarProps {
  navigationItems: NavigationItem[];
  currentPage: string;
  collapsed: boolean;
  onNavigate: (pageId: string) => void;
  onToggle: () => void;
  appConfig: {
    name: string;
    version: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigationItems,
  currentPage,
  collapsed,
  onNavigate,
  onToggle,
  appConfig,
}) => {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Circle;
    return Icon;
  };

  return (
    <div
      className={clsx(
        'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* App header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            MC
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-gray-900">{appConfig.name}</h1>
              <p className="text-xs text-gray-500">v{appConfig.version}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={clsx(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    )}
                  />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={clsx(
                        'text-xs px-2 py-1 rounded-full',
                        isActive
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icons.PanelLeftOpen
            className={clsx(
              'h-5 w-5 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
};
