import { Bell, Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import UserMenu from './UserMenu';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export default function Header({ setSidebarOpen, sidebarOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="hidden lg:block -m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">{sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}</span>
        {sidebarOpen ? (
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-10 w-full rounded-md border-0 bg-white py-2 pl-12 pr-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center justify-center p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">3</span>
            </button>
            
            {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
          </div>
          
          <ThemeToggle />
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-300 dark:lg:bg-gray-700" aria-hidden="true" />
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
}