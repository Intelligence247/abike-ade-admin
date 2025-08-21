// "use client"

// import { useEffect, useState } from 'react'
// import { StatsCards } from '@/components/admin/stats-cards'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { useAdmin } from '@/components/admin/admin-provider'
// import { Users, Building, CreditCard, MessageSquare } from 'lucide-react'
// import { formatDistanceToNow } from 'date-fns'

// interface RecentActivity {
//   id: number
//   type: 'payment' | 'user' | 'room'
//   title: string
//   description: string
//   date: string
//   status?: string
// }

// export default function AdminDashboard() {
//   const { admin } = useAdmin()
//   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (!admin) return

//     const fetchRecentActivities = async () => {
//       try {
//         setLoading(true)
//         const activities: RecentActivity[] = []

//         // Fetch recent transactions
//         admin.transaction.transactionList({
//           params: { per_page: 5, sort_by: '-date' },
//           onSuccess: (data: any) => {
//             if (data.status === 'success' && data.data) {
//               data.data.forEach((transaction: any) => {
//                 activities.push({
//                   id: transaction.id,
//                   type: 'payment',
//                   title: `Payment: ${transaction.reference}`,
//                   description: `${transaction.student?.first_name} ${transaction.student?.last_name} - ${transaction.room?.title}`,
//                   date: transaction.date || new Date().toISOString(),
//                   status: transaction.status
//                 })
//               })
//             }

//             // Fetch recent users
//             admin.user.userList({
//               params: { per_page: 3, sort_by: '-created' },
//               onSuccess: (userData: any) => {
//                 if (userData.status === 'success' && userData.data) {
//                   userData.data.forEach((user: any) => {
//                     activities.push({
//                       id: user.id,
//                       type: 'user',
//                       title: 'New User Registration',
//                       description: `${user.first_name} ${user.last_name} - ${user.email}`,
//                       date: new Date().toISOString(), // API doesn't show user creation date
//                       status: user.user?.is_active ? 'Active' : 'Inactive'
//                     })
//                   })
//                 }

//                 // Fetch recent rooms
//                 admin.room.roomList({
//                   params: { per_page: 3, sort_by: '-created' },
//                   onSuccess: (roomData: any) => {
//                     if (roomData.status === 'success' && roomData.data) {
//                       roomData.data.forEach((room: any) => {
//                         activities.push({
//                           id: room.id,
//                           type: 'room',
//                           title: `Room: ${room.title}`,
//                           description: `Price: ₦${room.price} - ${room.available ? 'Available' : 'Occupied'}`,
//                           date: new Date().toISOString(), // API doesn't show room creation date
//                           status: room.available ? 'Available' : 'Occupied'
//                         })
//                       })
//                     }

//                     // Sort activities by date and take the most recent 8
//                     const sortedActivities = activities
//                       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//                       .slice(0, 8)

//                     setRecentActivities(sortedActivities)
//                     setLoading(false)
//                   },
//                   onError: (error: any) => {
//                     console.error('Error fetching rooms:', error)
//                     setLoading(false)
//                   }
//                 })
//               },
//               onError: (error: any) => {
//                 console.error('Error fetching users:', error)
//                 setLoading(false)
//               }
//             })
//           },
//           onError: (error: any) => {
//             console.error('Error fetching transactions:', error)
//             setLoading(false)
//           }
//         })
//       } catch (error) {
//         console.error('Error fetching activities:', error)
//         setLoading(false)
//       }
//     }

//     fetchRecentActivities()
//   }, [admin])

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case 'payment':
//         return <CreditCard className="h-4 w-4 text-green-600" />
//       case 'user':
//         return <Users className="h-4 w-4 text-blue-600" />
//       case 'room':
//         return <Building className="h-4 w-4 text-purple-600" />
//       default:
//         return <MessageSquare className="h-4 w-4 text-gray-600" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'active':
//       case 'available':
//       case 'success':
//         return 'bg-green-100 text-green-800'
//       case 'inactive':
//       case 'occupied':
//         return 'bg-red-100 text-red-800'
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800'
//       default:
//         return 'bg-gray-100 text-gray-800'
//     }
//   }

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
//       {/* Page Header */}
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
//           Dashboard
//         </h1>
//         <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-3">
//           Welcome to your admin dashboard. Here's an overview of your system.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <StatsCards />

//       {/* Recent Activities */}
//       <Card className="overflow-hidden">
//         <CardHeader className="px-4 sm:px-6 py-6">
//           <CardTitle className="text-xl sm:text-2xl">Recent Activities</CardTitle>
//           <CardDescription className="text-base sm:text-lg">
//             Latest transactions, user registrations, and room updates
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="px-4 sm:px-6 pb-6">
//           {loading ? (
//             <div className="space-y-4 sm:space-y-5">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <div key={i} className="flex items-center space-x-4">
//                   <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
//                   <div className="space-y-2 flex-1 min-w-0">
//                     <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : recentActivities.length > 0 ? (
//             <div className="space-y-4 sm:space-y-5">
//               {recentActivities.map((activity) => (
//                 <div key={activity.id} className="flex items-start space-x-4 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
//                   <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                     {getActivityIcon(activity.type)}
//                   </div>
//                   <div className="flex-1 space-y-2 min-w-0">
//                     <p className="text-base font-medium leading-tight line-clamp-1">{activity.title}</p>
//                     <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">{activity.description}</p>
//                   </div>
//                   <div className="flex flex-col items-end space-y-2 flex-shrink-0">
//                     {activity.status && (
//                       <Badge className={`text-sm px-3 py-1 ${getStatusColor(activity.status)}`}>
//                         {activity.status}
//                       </Badge>
//                     )}
//                     <span className="text-sm text-muted-foreground whitespace-nowrap">
//                       {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 sm:py-12 text-muted-foreground">
//               <p className="text-base sm:text-lg">No recent activities found</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from 'react'
import { StatsCards } from '@/components/admin/stats-cards'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/components/admin/admin-provider'
import { Users, Building, CreditCard, MessageSquare } from 'lucide-react'
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
        console.error('Error fetching activities:', error)
        setLoading(false)
      }
    }

    fetchRecentActivities()
  }, [admin])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-600" />
      case 'user':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'room':
        return <Building className="h-4 w-4 text-purple-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Welcome to your admin dashboard. Here's an overview of your system.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="w-full">
            <StatsCards />
          </div>

          {/* Recent Activities */}
          <Card className="w-full overflow-hidden shadow-sm">
            <CardHeader className="border-b bg-white dark:bg-gray-900 px-4 py-5 sm:px-6">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold sm:text-xl">Recent Activities</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Latest transactions, user registrations, and room updates
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-4 sm:px-6 sm:py-5">
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                        </div>
                        <div className="flex flex-col space-y-2 items-end">
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={`${activity.type}-${activity.id}-${index}`} 
                      className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150 sm:px-6 sm:py-5"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 sm:text-sm">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                          {activity.status && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-1 font-medium border ${getStatusColor(activity.status)}`}
                            >
                              {activity.status}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-12 text-center sm:px-6">
                  <div className="space-y-2">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-500 sm:text-base">No recent activities found</p>
                    <p className="text-xs text-gray-400">Activities will appear here as they occur</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}