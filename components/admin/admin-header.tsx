"use client"

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

interface AdminHeaderProps {
  title?: string
  description?: string
  showSearch?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  className?: string
}

export function AdminHeader({ 
  title, 
  description, 
  showSearch = true, 
  showNotifications = true, 
  showThemeToggle = true,
  className = ""
}: AdminHeaderProps) {
  return (
    <header className={`flex h-16 items-center gap-2 border-b border-gray-200 dark:border-gray-800 px-4 ${className}`}>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1">
          {title && (
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[300px] pl-8"
              />
            </div>
          )}
          
          {showNotifications && (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">New payment received</p>
                  <p className="text-xs text-muted-foreground">John Doe made a payment of ₦230,000</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">Jane Smith registered for Room 5</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Room assignment expired</p>
                  <p className="text-xs text-muted-foreground">Room 3 assignment has expired</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
          
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  )
}
