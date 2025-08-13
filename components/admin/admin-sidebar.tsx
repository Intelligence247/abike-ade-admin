"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, Building, CreditCard, Images, MessageSquare, Megaphone, Settings, Wallet, ChevronDown, LogOut, User, Bell } from 'lucide-react'
import { useAdmin } from './admin-provider'

const navigation = [
  {
    title: 'Overview',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    icon: Users,
    items: [
      { title: 'User List', url: '/admin/users' },
      { title: 'User Management', url: '/admin/users/management' },
    ],
  },
  {
    title: 'Rooms',
    icon: Building,
    items: [
      { title: 'Room List', url: '/admin/rooms' },
      { title: 'Add Room', url: '/admin/rooms/add' },
      { title: 'Room Assignments', url: '/admin/rooms/assignments' },
    ],
  },
  {
    title: 'Transactions',
    icon: CreditCard,
    items: [
      { title: 'Transaction List', url: '/admin/transactions' },
      { title: 'Refunds', url: '/admin/transactions/refunds' },
      { title: 'Payment Reports', url: '/admin/transactions/reports' },
    ],
  },
  {
    title: 'Gallery',
    icon: Images,
    items: [
      { title: 'Image Management', url: '/admin/gallery' },
      { title: 'Featured Images', url: '/admin/gallery/featured' },
    ],
  },
  {
    title: 'Communications',
    icon: MessageSquare,
    items: [
      { title: 'Messages', url: '/admin/messages' },
      { title: 'Broadcasts', url: '/admin/broadcasts' },
      { title: 'Notifications', url: '/admin/notifications' },
    ],
  },
  {
    title: 'Site Management',
    icon: Settings,
    items: [
      { title: 'Site Info', url: '/admin/site' },
      { title: 'Settings', url: '/admin/settings' },
    ],
  },
  {
    title: 'Wallet',
    icon: Wallet,
    items: [
      { title: 'Balance', url: '/admin/wallet' },
      { title: 'Bank List', url: '/admin/wallet/banks' },
      { title: 'Transfers', url: '/admin/wallet/transfers' },
    ],
  },
]

export function AdminSidebar() {
  const { user, logout } = useAdmin()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AC</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Abike Ade Court</span>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <div>
                  <button
                    onClick={() => toggleItem(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedItems.includes(item.title) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.url}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            pathname === subItem.url
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === item.url
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'admin@abikeadecourt.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
