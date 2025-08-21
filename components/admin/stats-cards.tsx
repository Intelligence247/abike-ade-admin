// "use client"

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Users, Building, CreditCard, TrendingUp, MessageSquare, Image, Settings, Bell } from 'lucide-react'
// import { useAdmin } from './admin-provider'
// import { Skeleton } from '@/components/ui/skeleton'
// import Link from 'next/link'

// interface StatsData {
//   totalUsers: number
//   totalRooms: number
//   totalTransactions: number
//   totalRevenue: number
//   availableRooms: number
//   occupiedRooms: number
//   totalMessages: number
//   totalNotifications: number
//   totalGalleryImages: number
// }

// export function StatsCards() {
//   const { admin } = useAdmin()
//   const [stats, setStats] = useState<StatsData | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (!admin) return

//     const fetchStats = async () => {
//       try {
//         setLoading(true)
        
//         // Initialize counters
//         let totalUsers = 0
//         let totalRooms = 0
//         let totalTransactions = 0
//         let totalRevenue = 0
//         let availableRooms = 0
//         let occupiedRooms = 0
//         let totalMessages = 0
//         let totalNotifications = 0
//         let totalGalleryImages = 0

//         // Fetch users count
//         admin.user.userList({
//           params: { per_page: 1 }, // Just get first page to get total count
//           onSuccess: (data: any) => {
//             if (data.status === 'success') {
//               totalUsers = data.total_items || 0
              
//               // Fetch rooms count
//               admin.room.roomList({
//                 params: { per_page: 1 },
//                 onSuccess: (roomData: any) => {
//                   if (roomData.status === 'success') {
//                     totalRooms = roomData.total_items || 0
                    
//                     // Fetch available rooms
//                     admin.room.roomList({
//                       params: { available: true, per_page: 1 },
//                       onSuccess: (availableData: any) => {
//                         if (availableData.status === 'success') {
//                           availableRooms = availableData.total_items || 0
//                           occupiedRooms = totalRooms - availableRooms
                          
//                           // Fetch transactions
//                           admin.transaction.transactionList({
//                             params: { per_page: 1 },
//                             onSuccess: (transactionData: any) => {
//                               if (transactionData.status === 'success') {
//                                 totalTransactions = transactionData.total_items || 0
                                
//                                 // Calculate total revenue from successful transactions
//                                 if (transactionData.data && Array.isArray(transactionData.data)) {
//                                   totalRevenue = transactionData.data.reduce((sum: number, transaction: any) => {
//                                     if (transaction.status === 'Successful') {
//                                       return sum + (transaction.amount || 0)
//                                     }
//                                     return sum
//                                   }, 0)
//                                 }
                                
//                                 // Fetch gallery images count
//                                 admin.gallery.imageList({
//                                   params: { per_page: 1 },
//                                   onSuccess: (galleryData: any) => {
//                                     if (galleryData.status === 'success') {
//                                       totalGalleryImages = galleryData.total_items || 0
                                      
//                                       // Update stats
//                                       setStats({
//                                         totalUsers,
//                                         totalRooms,
//                                         totalTransactions,
//                                         totalRevenue,
//                                         availableRooms,
//                                         occupiedRooms,
//                                         totalMessages,
//                                         totalNotifications,
//                                         totalGalleryImages
//                                       })
//                                       setLoading(false)
//                                     }
//                                   },
//                                   onError: (error: any) => {
//                                     console.error('Error fetching gallery images:', error)
//                                     // Update stats without gallery count
//                                     setStats({
//                                       totalUsers,
//                                       totalRooms,
//                                       totalTransactions,
//                                       totalRevenue,
//                                       availableRooms,
//                                       occupiedRooms,
//                                       totalMessages,
//                                       totalNotifications,
//                                       totalGalleryImages
//                                     })
//                                     setLoading(false)
//                                   }
//                                 })
//                                 setLoading(false)
//                               }
//                             },
//                             onError: (error: any) => {
//                               console.error('Error fetching transactions:', error)
//                               setLoading(false)
//                             }
//                           })
//                         }
//                       },
//                       onError: (error: any) => {
//                         console.error('Error fetching available rooms:', error)
//                         setLoading(false)
//                       }
//                     })
//                   }
//                 },
//                 onError: (error: any) => {
//                   console.error('Error fetching rooms:', error)
//                   setLoading(false)
//                 }
//               })
//             }
//           },
//           onError: (error: any) => {
//             console.error('Error fetching users:', error)
//             setLoading(false)
//           }
//         })
//       } catch (error) {
//         console.error('Error fetching stats:', error)
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [admin])

//   if (loading) {
//     return (
//       <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <Card key={i} className="p-3 sm:p-4">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//               <Skeleton className="h-4 w-20" />
//               <Skeleton className="h-4 w-4" />
//             </CardHeader>
//             <CardContent className="px-0 pb-0">
//               <Skeleton className="h-6 sm:h-8 w-16" />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   if (!stats) {
//     return (
//       <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//         <Card className="p-3 sm:p-4">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0 w-full">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">0</div>
//           </CardContent>
//         </Card>
//         <Card className="p-3 sm:p-4">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Rooms</CardTitle>
//             <Building className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">0</div>
//           </CardContent>
//         </Card>
//         <Card className="p-3 sm:p-4">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Transactions</CardTitle>
//             <CreditCard className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">0</div>
//           </CardContent>
//         </Card>
//         <Card className="p-3 sm:p-4">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">₦0</div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//       <Link href="/admin/users">
//         <Card className="hover:shadow-lg transition-shadow cursor-pointer p-3 sm:p-4 h-full">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">{stats.totalUsers}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Registered users
//             </p>
//           </CardContent>
//         </Card>
//       </Link>
      
//       <Link href="/admin/rooms">
//         <Card className="hover:shadow-lg transition-shadow cursor-pointer p-3 sm:p-4 h-full">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Rooms</CardTitle>
//             <Building className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">{stats.totalRooms}</div>
//             <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//               {stats.availableRooms} available, {stats.occupiedRooms} occupied
//             </p>
//           </CardContent>
//         </Card>
//       </Link>
      
//       <Link href="/admin/transactions">
//         <Card className="hover:shadow-lg transition-shadow cursor-pointer p-3 sm:p-4 h-full">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Transactions</CardTitle>
//             <CreditCard className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">{stats.totalTransactions}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               Payment transactions
//             </p>
//           </CardContent>
//         </Card>
//       </Link>
      
//       <Link href="/admin/transactions">
//         <Card className="hover:shadow-lg transition-shadow cursor-pointer p-3 sm:p-4 h-full">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0">
//             <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="px-0 pb-0">
//             <div className="text-lg sm:text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//               From successful payments
//             </p>
//           </CardContent>
//         </Card>
//       </Link>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building, CreditCard, TrendingUp, MessageSquare, Image, Settings, Bell } from 'lucide-react'
import { useAdmin } from './admin-provider'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface StatsData {
  totalUsers: number
  totalRooms: number
  totalTransactions: number
  totalRevenue: number
  availableRooms: number
  occupiedRooms: number
  totalMessages: number
  totalNotifications: number
  totalGalleryImages: number
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
        let totalMessages = 0
        let totalNotifications = 0
        let totalGalleryImages = 0

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
                                
                                // Fetch gallery images count
                                admin.gallery.imageList({
                                  params: { per_page: 1 },
                                  onSuccess: (galleryData: any) => {
                                    if (galleryData.status === 'success') {
                                      totalGalleryImages = galleryData.total_items || 0
                                      
                                      // Update stats
                                      setStats({
                                        totalUsers,
                                        totalRooms,
                                        totalTransactions,
                                        totalRevenue,
                                        availableRooms,
                                        occupiedRooms,
                                        totalMessages,
                                        totalNotifications,
                                        totalGalleryImages
                                      })
                                      setLoading(false)
                                    }
                                  },
                                  onError: (error: any) => {
                                    console.error('Error fetching gallery images:', error)
                                    // Update stats without gallery count
                                    setStats({
                                      totalUsers,
                                      totalRooms,
                                      totalTransactions,
                                      totalRevenue,
                                      availableRooms,
                                      occupiedRooms,
                                      totalMessages,
                                      totalNotifications,
                                      totalGalleryImages
                                    })
                                    setLoading(false)
                                  }
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
      <div className="w-full">
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="w-full">
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                0 available, 0 occupied
              </p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Payment transactions
              </p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">₦0</div>
              <p className="text-xs text-muted-foreground mt-1">
                From successful payments
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <Link href="/admin/users" className="block w-full">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/rooms" className="block w-full">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">{stats.totalRooms.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.availableRooms} available, {stats.occupiedRooms} occupied
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/transactions" className="block w-full">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Payment transactions
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/transactions" className="block w-full">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 md:px-6 md:pt-6">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
              <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From successful payments
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}