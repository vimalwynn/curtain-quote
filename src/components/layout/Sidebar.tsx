import { useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X, LayoutDashboard, Users, ShoppingBag, BarChart3, Settings, LogOut, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Quotations', href: '/quotations', icon: FileText },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Products', href: '/products', icon: ShoppingBag },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();
  
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-950 px-6 pb-4 pt-5 shadow-xl ring-1 ring-gray-900/10 dark:ring-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
                    <button
                      type="button"
                      className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <SidebarContent expanded={true} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
        open ? "lg:w-64" : "lg:w-20"
      )}>
        <div className={cn(
          "flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-950 pb-4 pt-5 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          open ? "px-6" : "px-2"
        )}>
          <div className={cn(
            "flex items-center mb-8",
            open ? "justify-between" : "justify-center"
          )}>
            {open && <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin</h2>}
            {!open && <LayoutDashboard className="h-8 w-8 text-gray-900 dark:text-white" />}
          </div>
          <SidebarContent expanded={open} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ expanded }: { expanded: boolean }) {
  const location = useLocation();
  
  return (
    <nav className="mt-5 flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    location.pathname === item.href
                      ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400',
                    'group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-all',
                    !expanded && 'justify-center'
                  )}
                >
                  <item.icon
                    className={cn(
                      location.pathname === item.href
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
                      'h-5 w-5 shrink-0 transition-colors'
                    )}
                    aria-hidden="true"
                  />
                  {expanded && item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <Link
            to="#"
            className={cn(
              "group flex gap-x-3 rounded-md p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400",
              !expanded && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" aria-hidden="true" />
            {expanded && 'Logout'}
          </Link>
        </li>
      </ul>
    </nav>
  );
}