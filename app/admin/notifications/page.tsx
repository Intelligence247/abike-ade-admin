"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Bell, Eye, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const fetchNotifications = async (page = 1) => {
    setLoading(true)
    try {
      admin.notification.list({
        params: {
          page,
          per_page: 20
        },
        onSuccess: (data) => {
          setNotifications(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch notifications",
            variant: "destructive",
          })
          setLoading(false)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Wait for admin SDK to be ready before fetching data
    if (!adminLoading && admin) {
      fetchNotifications()
    }
  }, [adminLoading, admin])

  const openViewDialog = (notification: any) => {
    setSelectedNotification(notification)
    setViewDialogOpen(true)
  }

  const unreadCount = notifications.filter(n => !n.seen).length

  const columns = [
    {
      header: "Notification",
      cell: (notification: any) => (
        <div className="flex items-start gap-3">
          <div className={`w-2 h-2 rounded-full mt-2 ${notification.seen ? 'bg-gray-300' : 'bg-blue-500'}`} />
          <div>
            <p className={`font-medium ${!notification.seen ? 'text-blue-600' : ''}`}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.detail}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      cell: (notification: any) => (
        <Badge variant={notification.seen ? 'secondary' : 'default'}>
          {notification.seen ? 'Read' : 'Unread'}
        </Badge>
      )
    },
    {
      header: "Date",
      cell: (notification: any) => {
        const date = notification.date ? new Date(notification.date) : null
        return (
          <div>
            <p className="text-sm">
              {date ? date.toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">
              {date ? formatDistanceToNow(date, { addSuffix: true }) : ''}
            </p>
          </div>
        )
      }
    },
    {
      header: "Actions",
      cell: (notification: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openViewDialog(notification)}
        >
          <Eye className="mr-1 h-3 w-3" />
          View
        </Button>
      )
    }
  ]

  // Show loading state while admin is initializing
  if (adminLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Notifications" 
        description="System notifications and alerts"
      />
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">All system notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalItems - unreadCount}</div>
            <p className="text-xs text-muted-foreground">Already viewed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Notifications ({totalItems})</CardTitle>
              <CardDescription>
                System notifications and important alerts
              </CardDescription>
            </div>
            <Button onClick={() => fetchNotifications(currentPage)} variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={notifications}
            columns={columns}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchNotifications(page)}
          />
        </CardContent>
      </Card>

      {/* View Notification Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>
              Full notification content and information
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectedNotification.seen ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <Badge variant={selectedNotification.seen ? 'secondary' : 'default'}>
                  {selectedNotification.seen ? 'Read' : 'Unread'}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedNotification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedNotification.date ? new Date(selectedNotification.date).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm">{selectedNotification.detail}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
