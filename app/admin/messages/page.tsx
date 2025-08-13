"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Search, MessageSquare, Reply, Eye } from 'lucide-react'
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

export default function MessagesPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  const fetchMessages = async (page = 1, search = '') => {
    setLoading(true)
    try {
      admin.message.messageList({
        params: {
          page,
          per_page: 20,
          search
        },
        onSuccess: (data) => {
          setMessages(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch messages",
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
      fetchMessages()
    }
  }, [adminLoading, admin])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMessages(1, searchTerm)
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !replyText.trim()) return

    try {
      admin.message.reply({
        formData: {
          message_id: selectedMessage.id,
          reply: replyText
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Reply sent successfully",
          })
          setReplyDialogOpen(false)
          setReplyText('')
          setSelectedMessage(null)
          fetchMessages()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to send reply",
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

  const openReplyDialog = (message: any) => {
    setSelectedMessage(message)
    setReplyText('')
    setReplyDialogOpen(true)
  }

  const openViewDialog = (message: any) => {
    setSelectedMessage(message)
    setViewDialogOpen(true)
  }

  const columns = [
    {
      header: "From",
      cell: (message: any) => (
        <div>
          <p className="font-medium">{message.name}</p>
          <p className="text-sm text-muted-foreground">{message.email}</p>
        </div>
      )
    },
    {
      header: "Subject",
      cell: (message: any) => (
        <div>
          <p className="font-medium">{message.subject}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {message.message?.substring(0, 100)}...
          </p>
        </div>
      )
    },
    {
      header: "Status",
      cell: (message: any) => (
        <Badge variant={message.replied ? 'default' : 'secondary'}>
          {message.replied ? 'Replied' : 'Pending'}
        </Badge>
      )
    },
    {
      header: "Date",
      cell: (message: any) => {
        const date = message.date ? new Date(message.date) : null
        return date ? formatDistanceToNow(date, { addSuffix: true }) : 'N/A'
      }
    },
    {
      header: "Actions",
      cell: (message: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openViewDialog(message)}
          >
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
          {!message.replied && (
            <Button
              size="sm"
              onClick={() => openReplyDialog(message)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Reply className="mr-1 h-3 w-3" />
              Reply
            </Button>
          )}
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
        title="Messages" 
        description="View and respond to user messages"
      />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Messages ({totalItems})</CardTitle>
              <CardDescription>
                Messages from users and visitors
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <DataTable
            data={messages}
            columns={columns}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchMessages(page, searchTerm)}
          />
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Full message content and details
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">From</Label>
                  <p className="text-sm">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <p className="text-sm">{selectedMessage.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              {selectedMessage.replied && selectedMessage.reply && (
                <div>
                  <Label className="text-sm font-medium">Your Reply</Label>
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.reply}</p>
                  </div>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Date</Label>
                <p className="text-sm">
                  {selectedMessage.date ? new Date(selectedMessage.date).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedMessage && !selectedMessage.replied && (
              <Button onClick={() => {
                setViewDialogOpen(false)
                openReplyDialog(selectedMessage)
              }}>
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Send a reply to {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReply} className="space-y-4">
            {selectedMessage && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-2">Original Message:</p>
                <p className="text-sm">{selectedMessage.message}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!replyText.trim()}>
                <Reply className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
