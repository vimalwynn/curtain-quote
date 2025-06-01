import { useEffect, useRef } from 'react';
import { X, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const notifications = [
  {
    id: '1',
    title: 'New user registered',
    description: 'John Smith just created an account.',
    time: '5 minutes ago',
    type: 'info',
    read: false,
  },
  {
    id: '2',
    title: 'System update',
    description: 'The system will undergo maintenance in 24 hours.',
    time: '2 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: '3',
    title: 'Payment processed',
    description: 'Monthly subscription payment was successful.',
    time: '1 day ago',
    type: 'success',
    read: true,
  },
];

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 overflow-hidden rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-5"
    >
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto p-1">
        {notifications.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No notifications</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <div 
                  className={cn(
                    "flex gap-x-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                    notification.read ? "opacity-75" : ""
                  )}
                >
                  <div className="flex-shrink-0 self-start pt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {notification.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <a
          href="#"
          className="block text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          View all notifications
        </a>
      </div>
    </div>
  );
}