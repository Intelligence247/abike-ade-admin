"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Building, User, CreditCard, Edit, Trash2, Users } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/admin/data-table'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function RoomDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [room, setRoom] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(true)

  const roomId = params.id as string

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails()
      fetchRoomTransactions()
    }
  }, [roomId])

  const fetchRoomDetails = async () => {
    try {
      admin.room.roomList({
        params: { room_id: parseInt(roomId) },
        onSuccess: (data) => {
          setRoom(data.data)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch room details",
            variant: "destructive",
          })
          setLoading(false)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchRoomTransactions = async () => {
    try {
      admin.transaction.transactionList({
        params: { room_id: parseInt(roomId) },
        onSuccess: (data) => {
          setTransactions(data.data || [])
          setTransactionsLoading(false)
        },
        onError: (error) => {
          setTransactionsLoading(false)
        }
      })
    } catch (error) {
      setTransactionsLoading(false)
    }
  }

  const handleDeleteRoom = async () => {
    try {
      admin.room.deleteRoom({
        formData: { room_id: parseInt(roomId) },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Room deleted successfully",
          })
          router.push('/admin/rooms')
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete room",
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

  const transactionColumns = [
    {
      header: "Reference",
      cell: (transaction: any) => (
        <span className="font-mono text-sm">{transaction.reference}</span>
      )
    },
    {
      header: "Student",
      cell: (transaction: any) => (
        <div>
          <p className="font-medium">
            {transaction.student?.first_name} {transaction.student?.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{transaction.student?.email}</p>
        </div>
      )
    },
    {
      header: "Amount",
      cell: (transaction: any) => `₦${transaction.amount?.toLocaleString()}`
    },
    {
      header: "Status",
      cell: (transaction: any) => (
        <Badge variant={transaction.status === 'Successful' ? 'default' : 'secondary'}>
          {transaction.status}
        </Badge>
      )
    },
    {
      header: "Date",
      cell: (transaction: any) => transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'
    }
  ]

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold">Room not found</h2>
          <p className="text-muted-foreground">The room you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <AdminHeader
          title={room.title}
          description="Room details and transaction history"
        />
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Room Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
              {room.thumbnail ? (
                <img
                  src={process.env.NEXT_PUBLIC_API_URL + "" + room.thumbnail || "/placeholder.svg"}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge variant={room.available ? 'default' : 'secondary'} className="text-sm">
                  {room.available ? 'Available' : 'Occupied'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{room.title}</h3>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
                  ₦{parseFloat(room.price).toLocaleString()}
                </p>
              </div>

              <Separator />

              <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Room ID:</span>
                    <span className="text-sm ml-2">{room.id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={room.available ? 'default' : 'secondary'} className="ml-2">
                      {room.available ? 'Available' : 'Occupied'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Price:</span>
                    <span className="text-sm ml-2 font-semibold text-green-600">
                      ₦{parseFloat(room.price).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {room.student && (
                    <div>
                      <span className="text-sm font-medium">Current Occupant:</span>
                      <div className="ml-2 mt-1">
                        <p className="text-sm font-medium">
                          {room.student.first_name} {room.student.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{room.student.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {room.features && (
                <div>
                  <span className="text-sm font-medium">Features & Description:</span>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{room.features}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href={`/admin/rooms/${room.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Room
              </Link>
            </Button>

            {room.student && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/admin/users/${room.student.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  View Occupant
                </Link>
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Room
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the room
                    and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRoom}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            All payment transactions for this room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={transactions}
            columns={transactionColumns}
            loading={transactionsLoading}
            currentPage={1}
            totalPages={1}
            onPageChange={() => { }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
