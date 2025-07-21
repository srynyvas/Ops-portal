import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavigationItem } from '../../types';

interface LayoutProps {
  children: ReactNode;
  navigationItems: NavigationItem[];
  currentPage: string;
  sidebarCollapsed: boolean;
  onNavigate: (pageId: string) => void;
  onToggleSidebar: () => void;
  appConfig: {
    name: string;
    version: string;
  };
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  navigationItems,
  currentPage,
  sidebarCollapsed,
  onNavigate,
  onToggleSidebar,
  appConfig,
}) => {
  const currentNavItem = navigationItems.find(item => item.id === currentPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        navigationItems={navigationItems}
        currentPage={currentPage}
        collapsed={sidebarCollapsed}
        onNavigate={onNavigate}
        onToggle={onToggleSidebar}
        appConfig={appConfig}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={currentNavItem?.label || 'Mission Control'}
          subtitle={currentNavItem?.description}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
        />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
