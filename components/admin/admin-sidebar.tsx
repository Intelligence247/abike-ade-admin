"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  CreditCard, 
  Images, 
  MessageSquare, 
  Settings, 
  Wallet, 
  ChevronDown, 
  LogOut, 
  User,
  X
} from 'lucide-react'
import { useAdmin } from './admin-provider'
import { cn } from '@/lib/utils'

// Simplified navigation structure - only essential routes
const navigation = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    icon: Users,
    items: [
      { title: 'All Users', url: '/admin/users' },
    ],
  },
  {
    title: 'Rooms',
    icon: Building,
    items: [
      { title: 'All Rooms', url: '/admin/rooms' },
      { title: 'Add Room', url: '/admin/rooms/add' },
      { title: 'Room Assignments', url: '/admin/rooms/assignments' },
    ],
  },
  {
    title: 'Transactions',
    icon: CreditCard,
    items: [
      { title: 'All Transactions', url: '/admin/transactions' },
      { title: 'Refunds', url: '/admin/transactions/refunds' },
      { title: 'Reports', url: '/admin/transactions/reports' },
    ],
  },
  {
    title: 'Gallery',
    icon: Images,
    items: [
      { title: 'Gallery', url: '/admin/gallery' },
      { title: 'Featured', url: '/admin/gallery/featured' },
    ],
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    url: '/admin/messages',
  },
  {
    title: 'Broadcasts',
    icon: MessageSquare,
    url: '/admin/broadcasts',
  },
  {
    title: 'Notifications',
    icon: MessageSquare,
    url: '/admin/notifications',
  },
  {
    title: 'Site',
    icon: Settings,
    url: '/admin/site',
  },
  {
    title: 'Settings',
    icon: Settings,
    url: '/admin/settings',
  },
  {
    title: 'Profile',
    icon: Settings,
    url: '/admin/profile',
  },
  {
    title: 'Wallet',
    icon: Wallet,
    items: [
      { title: 'Balance', url: '/admin/wallet' },
      { title: 'Banks', url: '/admin/wallet/banks' },
    ],
  },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const { user, logout } = useAdmin()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // Auto-expand items based on current path
  useEffect(() => {
    const currentSection = navigation.find(item => 
      item.items?.some(subItem => pathname.startsWith(subItem.url.split('/').slice(0, 3).join('/')))
    )
    if (currentSection && !expandedItems.includes(currentSection.title)) {
      setExpandedItems(prev => [...prev, currentSection.title])
    }
  }, [pathname, expandedItems])

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])



  const toggleItem = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (url: string) => {
    if (url === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(url)
  }

  const isSectionActive = (item: any) => {
    if (item.url) {
      return isActive(item.url)
    }
    return item.items?.some((subItem: any) => isActive(subItem.url))
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col transition-all duration-300 ease-in-out",
          // Mobile: full width, Desktop: fixed width
          "w-full lg:w-64",
          // Mobile logic: show when mobileOpen is true, hide when false
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Abike Ade Court logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                Abike Ade Court
              </span>
            </div>
            {/* Mobile close button */}
            {mobileOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileClose}
                className="lg:hidden p-1 h-8 w-8"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4">
            <nav className="space-y-2" role="navigation" aria-label="Main navigation">
              {navigation.map((item, index) => (
                <div key={item.title}>
                  {item.items ? (
                    <div>
                      <button
                        onClick={() => toggleItem(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                          isSectionActive(item)
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        )}
                        aria-expanded={expandedItems.includes(item.title)}
                        aria-controls={`nav-section-${item.title}`}
                        aria-label={`${item.title} section`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            expandedItems.includes(item.title) ? "rotate-180" : ""
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {expandedItems.includes(item.title) && (
                        <div 
                          id={`nav-section-${item.title}`}
                          className="ml-6 mt-1 space-y-1"
                          role="group"
                          aria-label={`${item.title} submenu`}
                        >
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-md transition-colors",
                                isActive(subItem.url)
                                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                              )}
                              aria-label={subItem.title}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.url!}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors group",
                        isActive(item.url!)
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      )}
                      aria-label={item.title}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800",
            isMobile ? "justify-center" : ""
          )}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Abike Ade Court logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            {!isMobile && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user ? `${user.first_name} ${user.last_name}` : 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'admin@abikeadecourt.com'}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
