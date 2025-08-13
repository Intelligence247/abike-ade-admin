"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { StatsCards } from '@/components/admin/stats-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/components/admin/admin-provider'
import { Plus, Users, Building, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivity {
  id: number
  type: 'payment' | 'user' | 'room'
  title: string
  description: string
  date: string
  status?: string
}

export default function AdminDashboard() {
  const { admin } = useAdmin()
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!admin) return

    const fetchRecentActivities = async () => {
      try {
        setLoading(true)
        const activities: RecentActivity[] = []

        // Fetch recent transactions
        admin.transaction.transactionList({
          params: { per_page: 5, sort_by: '-date' },
          onSuccess: (data: any) => {
            if (data.status === 'success' && data.data) {
              data.data.forEach((transaction: any) => {
                activities.push({
                  id: transaction.id,
                  type: 'payment',
                  title: `Payment: ${transaction.reference}`,
                  description: `${transaction.student?.first_name} ${transaction.student?.last_name} - ${transaction.room?.title}`,
                  date: transaction.date || new Date().toISOString(),
                  status: transaction.status
                })
              })
            }

            // Fetch recent users
            admin.user.userList({
              params: { per_page: 3, sort_by: '-created' },
              onSuccess: (userData: any) => {
                if (userData.status === 'success' && userData.data) {
                  userData.data.forEach((user: any) => {
                    activities.push({
                      id: user.id,
                      type: 'user',
                      title: 'New User Registration',
                      description: `${user.first_name} ${user.last_name} - ${user.email}`,
                      date: new Date().toISOString(), // API doesn't show user creation date
                      status: user.user?.is_active ? 'Active' : 'Inactive'
                    })
                  })
                }

                // Fetch recent rooms
                admin.room.roomList({
                  params: { per_page: 3, sort_by: '-created' },
                  onSuccess: (roomData: any) => {
                    if (roomData.status === 'success' && roomData.data) {
                      roomData.data.forEach((room: any) => {
                        activities.push({
                          id: room.id,
                          type: 'room',
                          title: `Room: ${room.title}`,
                          description: `Price: ₦${room.price} - ${room.available ? 'Available' : 'Occupied'}`,
                          date: new Date().toISOString(), // API doesn't show room creation date
                          status: room.available ? 'Available' : 'Occupied'
                        })
                      })
                    }

                    // Sort activities by date and take the most recent 8
                    const sortedActivities = activities
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 8)

                    setRecentActivities(sortedActivities)
                    setLoading(false)
                  },
                  onError: (error: any) => {
                    console.error('Error fetching rooms:', error)
                    setLoading(false)
                  }
                })
              },
              onError: (error: any) => {
                console.error('Error fetching users:', error)
                setLoading(false)
              }
            })
          },
          onError: (error: any) => {
            console.error('Error fetching transactions:', error)
            setLoading(false)
          }
        })
      } catch (error) {
        console.error('Error fetching recent activities:', error)
        setLoading(false)
      }
    }

    fetchRecentActivities()
  }, [admin])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <MessageSquare className="h-4 w-4" />
      case 'user':
        return <Users className="h-4 w-4" />
      case 'room':
        return <Building className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
      case 'inactive':
      case 'occupied':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Dashboard" 
        description="Welcome to the Abike Ade Court admin dashboard"
      />
      
      <StatsCards />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest transactions, user registrations, and room updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.status && (
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activities found
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/users/add">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </Link>
            <Link href="/admin/rooms/add">
              <Button className="w-full justify-start" variant="outline">
                <Building className="mr-2 h-4 w-4" />
                Add New Room
              </Button>
            </Link>
            <Link href="/admin/broadcasts/send">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Broadcast
              </Button>
            </Link>
            <Link href="/admin/transactions">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                View All Transactions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
