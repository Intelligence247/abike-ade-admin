"use client"

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: Array<{ name: string; href: string; icon?: typeof Home }> = [
      { name: 'Dashboard', href: '/admin', icon: Home }
    ]
    
    let currentPath = ''
    segments.forEach((segment, index) => {
      if (index === 0 && segment === 'admin') return
      
      currentPath += `/${segment}`
      
      // Convert segment to readable name
      let name = segment
        .replace(/\[.*?\]/g, '') // Remove dynamic route brackets
        .replace(/-/g, ' ') // Replace hyphens with spaces
        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
      
      // Handle special cases
      if (segment === 'users' && segments[index + 1] && !segments[index + 1].startsWith('[')) {
        name = 'User Management'
      } else if (segment === 'rooms' && segments[index + 1] && !segments[index + 1].startsWith('[')) {
        name = 'Room Management'
      } else if (segment === 'transactions' && segments[index + 1] && !segments[index + 1].startsWith('[')) {
        name = 'Transaction Management'
      }
      
      breadcrumbs.push({
        name,
        href: currentPath
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-300 dark:text-gray-600" />
            )}
            <a
              href={breadcrumb.href}
              className={cn(
                "flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
                index === breadcrumbs.length - 1 
                  ? "text-gray-900 dark:text-gray-100 font-medium" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
              <span>{breadcrumb.name}</span>
            </a>
          </div>
        ))}
      </nav>

      {/* Page Title and Description */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
