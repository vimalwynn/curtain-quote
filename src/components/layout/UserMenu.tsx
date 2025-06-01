import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function UserMenu() {
  const [userImage] = useState('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2');

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="-m-1.5 flex items-center p-1.5 focus:outline-none">
        <span className="sr-only">Open user menu</span>
        <img
          className="h-8 w-8 rounded-full bg-gray-50 object-cover ring-2 ring-white dark:ring-gray-700 transition-all hover:ring-blue-500"
          src={userImage}
          alt="User"
        />
        <span className="hidden lg:flex lg:items-center ml-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200" aria-hidden="true">
            John Doe
          </span>
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">john.doe@example.com</p>
          </div>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cn(
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                )}
              >
                <User className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cn(
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                )}
              >
                <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                Settings
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cn(
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                )}
              >
                <HelpCircle className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                Support
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#"
                className={cn(
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                )}
              >
                <LogOut className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                Sign out
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}