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
import { Search, Users, Building, Eye, UserX, UserPlus, Calendar } from 'lucide-react'
import Link from 'next/link'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
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

export default function RoomAssignmentsPage() {
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<any[]>([])
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assignForm, setAssignForm] = useState({
    room_id: '',
    user_id: '',
    months: '12'
  })

  const fetchAssignments = async (page = 1, search = '') => {
    setLoading(true)
    try {
      // Fetch occupied rooms (rooms with students assigned)
      admin.room.roomList({
        params: {
          page,
          per_page: 20,
          search,
          available: false // Only occupied rooms
        },
        onSuccess: (data: any) => {
          setAssignments(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: "Failed to fetch room assignments",
            variant: "destructive",
          })
          setLoading(false)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchAvailableRooms = async () => {
    try {
      admin.room.roomList({
        params: {
          available: true,
          per_page: 100
        },
        onSuccess: (data: any) => {
          setAvailableRooms(data.data || [])
        },
        onError: (error: any) => {
          console.error('Failed to fetch available rooms:', error)
        }
      })
    } catch (error) {
      console.error('Error fetching available rooms:', error)
    }
  }

  const fetchAvailableUsers = async () => {
    try {
      admin.user.userList({
        params: {
          per_page: 100,
          sort_by: 'first_name'
        },
        onSuccess: (data: any) => {
          setAvailableUsers(data.data || [])
        },
        onError: (error: any) => {
          console.error('Failed to fetch available users:', error)
        }
      })
    } catch (error) {
      console.error('Error fetching available users:', error)
    }
  }

  useEffect(() => {
    fetchAssignments()
    fetchAvailableRooms()
    fetchAvailableUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAssignments(1, searchTerm)
  }

  const handleAssignRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignForm.room_id || !assignForm.user_id) {
      toast({
        title: "Error",
        description: "Please select both room and user",
        variant: "destructive",
      })
      return
    }

    try {
      admin.room.assignRoom({
        formData: {
          room_id: parseInt(assignForm.room_id),
          user_id: parseInt(assignForm.user_id),
          months: parseInt(assignForm.months)
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Room assigned successfully",
          })
          setAssignDialogOpen(false)
          setAssignForm({ room_id: '', user_id: '', months: '12' })
          fetchAssignments()
          fetchAvailableRooms() // Refresh available rooms
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to assign room",
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

  const handleUnassignRoom = async (roomId: number) => {
    try {
      // Note: The API doesn't have unassignRoom, so we'll just show a message
      toast({
        title: "Info",
        description: "Room unassignment requires backend support. Contact administrator.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      header: "Room",
      cell: (assignment: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">
              ₦{parseFloat(assignment.price).toLocaleString()}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Student",
      cell: (assignment: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium">
              {assignment.student?.first_name} {assignment.student?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {assignment.student?.email}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Assignment Period",
      cell: (assignment: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm">
              {assignment.expiration_date ? 
                new Date(assignment.expiration_date).toLocaleDateString() : 
                'Not specified'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {assignment.duration || 12} months
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      cell: (assignment: any) => (
        <Badge variant="secondary">
          Occupied
        </Badge>
      )
    },
    {
      header: "Actions",
      cell: (assignment: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <Link href={`/admin/rooms/${assignment.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              View
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUnassignRoom(assignment.id)}
          >
            <UserX className="mr-1 h-3 w-3" />
            Unassign
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader
        title="Room Assignments"
        description="Manage room assignments and student allocations"
      />

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-xl md:text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active room assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-xl md:text-2xl font-bold text-green-600">{availableRooms.length}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Users</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-xl md:text-2xl font-bold text-purple-600">{availableUsers.length}</div>
            <p className="text-xs text-muted-foreground">Eligible for rooms</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Room Assignments ({totalItems})</CardTitle>
              <CardDescription>
                Currently assigned rooms and student allocations
              </CardDescription>
            </div>
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Assign Room to Student</DialogTitle>
                  <DialogDescription>
                    Select a room and student to create a new assignment
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAssignRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Select Room</Label>
                    <Select value={assignForm.room_id} onValueChange={(value) => setAssignForm(prev => ({ ...prev, room_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            {room.title} - ₦{parseFloat(room.price).toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user">Select Student</Label>
                    <Select value={assignForm.user_id} onValueChange={(value) => setAssignForm(prev => ({ ...prev, user_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.first_name} {user.last_name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="months">Duration (months)</Label>
                    <Select value={assignForm.months} onValueChange={(value) => setAssignForm(prev => ({ ...prev, months: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 month</SelectItem>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months (1 year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setAssignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!assignForm.room_id || !assignForm.user_id}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Room
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
                placeholder="Search assignments by room title or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <DataTable
            data={assignments}
            columns={columns}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchAssignments(page, searchTerm)}
          />

          {assignments.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No room assignments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No assignments match your search criteria.' : 'No rooms are currently assigned to students.'}
              </p>
              <Button onClick={() => setAssignDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign First Room
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
