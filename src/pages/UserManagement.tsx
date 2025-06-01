import { useState } from 'react';
import { users } from '../data/mockData';
import { formatDate } from '../utils/formatDate';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import { User, Plus, Filter, Search, MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'name', 
      header: 'User', 
      sortable: true,
      render: (user: typeof users[0]) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      header: 'Role', 
      sortable: true,
      render: (user: typeof users[0]) => (
        <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          {user.role}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (user: typeof users[0]) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          user.status === 'Active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {user.status === 'Active' ? (
            <UserCheck className="mr-1 h-3 w-3" />
          ) : (
            <UserX className="mr-1 h-3 w-3" />
          )}
          {user.status}
        </span>
      )
    },
    { 
      key: 'lastLogin', 
      header: 'Last Login', 
      sortable: true,
      render: (user: typeof users[0]) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDate(user.lastLogin)}
        </span>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (user: typeof users[0]) => (
        <div className="flex space-x-2">
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Edit className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add User
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
            <select className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          zebra={true}
        />
      </div>
    </div>
  );
}