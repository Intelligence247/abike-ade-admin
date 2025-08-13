"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building, CreditCard, TrendingUp } from 'lucide-react'
import { useAdmin } from './admin-provider'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsData {
  totalUsers: number
  totalRooms: number
  totalTransactions: number
  totalRevenue: number
  availableRooms: number
  occupiedRooms: number
}

export function StatsCards() {
  const { admin } = useAdmin()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!admin) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Initialize counters
        let totalUsers = 0
        let totalRooms = 0
        let totalTransactions = 0
        let totalRevenue = 0
        let availableRooms = 0
        let occupiedRooms = 0

        // Fetch users count
        admin.user.userList({
          params: { per_page: 1 }, // Just get first page to get total count
          onSuccess: (data: any) => {
            if (data.status === 'success') {
              totalUsers = data.total_items || 0
              
              // Fetch rooms count
              admin.room.roomList({
                params: { per_page: 1 },
                onSuccess: (roomData: any) => {
                  if (roomData.status === 'success') {
                    totalRooms = roomData.total_items || 0
                    
                    // Fetch available rooms
                    admin.room.roomList({
                      params: { available: true, per_page: 1 },
                      onSuccess: (availableData: any) => {
                        if (availableData.status === 'success') {
                          availableRooms = availableData.total_items || 0
                          occupiedRooms = totalRooms - availableRooms
                          
                          // Fetch transactions
                          admin.transaction.transactionList({
                            params: { per_page: 1 },
                            onSuccess: (transactionData: any) => {
                              if (transactionData.status === 'success') {
                                totalTransactions = transactionData.total_items || 0
                                
                                // Calculate total revenue from successful transactions
                                if (transactionData.data && Array.isArray(transactionData.data)) {
                                  totalRevenue = transactionData.data.reduce((sum: number, transaction: any) => {
                                    if (transaction.status === 'Successful') {
                                      return sum + (transaction.amount || 0)
                                    }
                                    return sum
                                  }, 0)
                                }
                                
                                // Update stats
                                setStats({
                                  totalUsers,
                                  totalRooms,
                                  totalTransactions,
                                  totalRevenue,
                                  availableRooms,
                                  occupiedRooms
                                })
                                setLoading(false)
                              }
                            },
                            onError: (error: any) => {
                              console.error('Error fetching transactions:', error)
                              setLoading(false)
                            }
                          })
                        }
                      },
                      onError: (error: any) => {
                        console.error('Error fetching available rooms:', error)
                        setLoading(false)
                      }
                    })
                  }
                },
                onError: (error: any) => {
                  console.error('Error fetching rooms:', error)
                  setLoading(false)
                }
              })
            }
          },
          onError: (error: any) => {
            console.error('Error fetching users:', error)
            setLoading(false)
          }
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [admin])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦0</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Registered users
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRooms}</div>
          <p className="text-xs text-muted-foreground">
            {stats.availableRooms} available, {stats.occupiedRooms} occupied
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">
            Payment transactions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            From successful payments
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
