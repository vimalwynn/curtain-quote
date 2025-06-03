import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Layout({ children, sidebarOpen, setSidebarOpen }: LayoutProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme} min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-200`}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}