"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Search, Send, Plus, Eye, RefreshCw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'

export default function BroadcastsPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [broadcasts, setBroadcasts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedBroadcast, setSelectedBroadcast] = useState<any>(null)
  const [broadcastForm, setBroadcastForm] = useState({
    subject: '',
    message: ''
  })

  const fetchBroadcasts = async (page = 1, search = '') => {
    setLoading(true)
    try {
      admin.broadcast.broadcastList({
        params: {
          page,
          per_page: 20,
          search
        },
        onSuccess: (data) => {
          setBroadcasts(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch broadcasts",
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
      fetchBroadcasts()
    }
  }, [adminLoading, admin])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBroadcasts(1, searchTerm)
  }

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastForm.subject.trim() || !broadcastForm.message.trim()) return

    try {
      admin.broadcast.send({
        formData: {
          subject: broadcastForm.subject,
          message: broadcastForm.message
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Broadcast sent successfully",
          })
          setCreateDialogOpen(false)
          setBroadcastForm({ subject: '', message: '' })
          fetchBroadcasts()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to send broadcast",
            variant: "destructive",
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleResendBroadcast = async (broadcastId: number) => {
    try {
      admin.broadcast.send({
        formData: { broadcast_id: broadcastId },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Broadcast resent successfully",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to resend broadcast",
            variant: "destructive",
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const openViewDialog = (broadcast: any) => {
    setSelectedBroadcast(broadcast)
    setViewDialogOpen(true)
  }

  const columns = [
    {
      header: "Subject",
      cell: (broadcast: any) => (
        <div>
          <p className="font-medium">{broadcast.subject}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {broadcast.message?.replace(/<[^>]*>/g, '').substring(0, 100)}...
          </p>
        </div>
      )
    },
    {
      header: "Date Sent",
      cell: (broadcast: any) => {
        const date = broadcast.date ? new Date(broadcast.date) : null
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
      cell: (broadcast: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openViewDialog(broadcast)}
          >
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => handleResendBroadcast(broadcast.id)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Resend
          </Button>
        </div>
      )
    }
  ]

  // Show loading state while admin is initializing
  if (adminLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Broadcast Messages" 
        description="Send announcements to all users"
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Broadcasts ({totalItems})</CardTitle>
              <CardDescription>
                Messages sent to all registered users
              </CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Broadcast
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Broadcast</DialogTitle>
                  <DialogDescription>
                    Send a message to all registered users
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateBroadcast} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={broadcastForm.subject}
                      onChange={(e) => setBroadcastForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter broadcast subject..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={broadcastForm.message}
                      onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter your message here..."
                      rows={8}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      HTML formatting is supported
                    </p>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!broadcastForm.subject.trim() || !broadcastForm.message.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Broadcast
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search broadcasts by subject or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <DataTable
            data={broadcasts}
            columns={columns}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchBroadcasts(page, searchTerm)}
          />
        </CardContent>
      </Card>

      {/* View Broadcast Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Broadcast Details</DialogTitle>
            <DialogDescription>
              Full broadcast content and details
            </DialogDescription>
          </DialogHeader>
          {selectedBroadcast && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <p className="text-lg font-semibold">{selectedBroadcast.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: selectedBroadcast.message }}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Date Sent</Label>
                <p className="text-sm">
                  {selectedBroadcast.date ? new Date(selectedBroadcast.date).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedBroadcast && (
              <Button onClick={() => {
                setViewDialogOpen(false)
                handleResendBroadcast(selectedBroadcast.id)
              }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Broadcast
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
