"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Users, UserCheck, UserX, Shield, Download, Upload } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function UserManagementPage() {
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    pendingUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [bulkMessage, setBulkMessage] = useState('')

  const fetchStats = async () => {
    setLoading(true)
    try {
      // Fetch user statistics
      admin.user.userList({
        params: { per_page: 1 },
        onSuccess: async (data) => {
          const totalUsers = data.total_items || 0
          
          // Fetch active users
          admin.user.userList({
            params: { per_page: 1, active: true },
            onSuccess: (activeData) => {
              const activeUsers = activeData.total_items || 0
              
              // Fetch verified users
              admin.user.userList({
                params: { per_page: 1, verified: true },
                onSuccess: (verifiedData) => {
                  const verifiedUsers = verifiedData.total_items || 0
                  
                  setStats({
                    totalUsers,
                    activeUsers,
                    verifiedUsers,
                    pendingUsers: totalUsers - verifiedUsers
                  })
                  setLoading(false)
                },
                onError: () => {
                  setStats(prev => ({ ...prev, totalUsers }))
                  setLoading(false)
                }
              })
            },
            onError: () => {
              setStats(prev => ({ ...prev, totalUsers }))
              setLoading(false)
            }
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch user statistics",
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
    fetchStats()
  }, [])

  const handleBulkAction = async (action: 'verify' | 'activate' | 'deactivate') => {
    try {
      // This would typically be a bulk operation endpoint
      toast({
        title: "Info",
        description: "Bulk operations are not yet implemented in the API",
        variant: "default",
      })
      setBulkActionDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      })
    }
  }

  const handleExportUsers = async () => {
    try {
      // This would typically export user data
      toast({
        title: "Info",
        description: "Export functionality will be available soon",
        variant: "default",
      })
      setExportDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export user data",
        variant: "destructive",
      })
    }
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "All registered users",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      description: "Currently active accounts",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers,
      description: "Verified accounts",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      title: "Pending Verification",
      value: stats.pendingUsers,
      description: "Awaiting verification",
      icon: UserX,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="User Management" 
        description="Advanced user management tools and analytics"
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bulk Actions
            </CardTitle>
            <CardDescription>
              Perform actions on multiple users at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button 
                onClick={() => handleBulkAction('verify')}
                className="w-full justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Verify All Pending Users
              </Button>
              <Button 
                onClick={() => handleBulkAction('activate')}
                variant="outline" 
                className="w-full justify-start"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Activate All Users
              </Button>
              <Button 
                onClick={() => handleBulkAction('deactivate')}
                variant="outline" 
                className="w-full justify-start"
              >
                <UserX className="mr-2 h-4 w-4" />
                Deactivate Inactive Users
              </Button>
            </div>

            <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Custom Bulk Action
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Custom Bulk Action</DialogTitle>
                  <DialogDescription>
                    Send a custom message to all users or perform a specific action
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk-message">Message to Users</Label>
                    <Textarea
                      id="bulk-message"
                      value={bulkMessage}
                      onChange={(e) => setBulkMessage(e.target.value)}
                      placeholder="Enter message to send to all users..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleBulkAction('verify')}>
                    Send Message
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export
            </CardTitle>
            <CardDescription>
              Export user data for analysis or backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button 
                onClick={handleExportUsers}
                className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Users (CSV)
              </Button>
              <Button 
                onClick={handleExportUsers}
                variant="outline" 
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Verified Users
              </Button>
              <Button 
                onClick={handleExportUsers}
                variant="outline" 
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Pending Users
              </Button>
            </div>

            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Custom Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Custom Export</DialogTitle>
                  <DialogDescription>
                    Configure custom export parameters
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">From Date</Label>
                    <Input
                      id="date-from"
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to">To Date</Label>
                    <Input
                      id="date-to"
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">CSV</Button>
                      <Button variant="outline" size="sm">Excel</Button>
                      <Button variant="outline" size="sm">PDF</Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleExportUsers}>
                    Export Data
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Management Tools */}
      <Card>
        <CardHeader>
          <CardTitle>User Management Tools</CardTitle>
          <CardDescription>
            Additional tools for managing user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Account Verification</h4>
              <p className="text-sm text-muted-foreground">
                Verify user accounts in bulk or individually. Verified users have 
                access to all platform features.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Data Export</h4>
              <p className="text-sm text-muted-foreground">
                Export user data for compliance, analysis, or backup purposes. 
                Multiple formats are supported.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Bulk Communications</h4>
              <p className="text-sm text-muted-foreground">
                Send messages to multiple users at once. Useful for announcements 
                and important updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
