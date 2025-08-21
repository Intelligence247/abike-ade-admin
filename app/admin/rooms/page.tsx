"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Search, Plus, Eye, Edit, Trash2, Users, Building } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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

export default function RoomsPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchRooms = async (page = 1, search = '') => {
    setLoading(true)
    try {
      admin.room.roomList({
        params: {
          page,
          per_page: 20,
          search,
          sort_by: 'title'
        },
        onSuccess: (data) => {
          setRooms(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch rooms",
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
      fetchRooms()
    }
  }, [adminLoading, admin])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchRooms(1, searchTerm)
  }

  const handleDeleteRoom = async (roomId: number) => {
    try {
      admin.room.deleteRoom({
        formData: { room_id: roomId },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Room deleted successfully",
          })
          fetchRooms(currentPage, searchTerm)
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

  const RoomCard = ({ room }: { room: any }) => (
    <Card className="overflow-hidden">
      <div className="aspect-video relative bg-gray-100">
        {room.thumbnail ? (
          <img
            src={process.env.NEXT_PUBLIC_API_URL + "" + room.thumbnail || "/placeholder.svg"}
            alt={room.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={room.available ? 'default' : 'secondary'}>
            {room.available ? 'Available' : 'Occupied'}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg">{room.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/rooms/${room.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/rooms/${room.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Room
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Room
                  </DropdownMenuItem>
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
                    <AlertDialogAction onClick={() => handleDeleteRoom(room.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <span className="text-lg font-semibold text-green-600">
              ₦{parseFloat(room.price).toLocaleString()}
            </span>
            {room.student && (
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-3 w-3" />
                {room.student.first_name} {room.student.last_name}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )

  const RoomListCard = ({ room }: { room: any }) => (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {room.thumbnail ? (
            <img
              src={process.env.NEXT_PUBLIC_API_URL + "" + room.thumbnail || "/placeholder.svg"}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="absolute top-1 right-1">
            <Badge variant={room.available ? 'default' : 'secondary'} className="text-xs">
              {room.available ? 'Available' : 'Occupied'}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h3 className="font-semibold text-lg">{room.title}</h3>
              <p className="text-sm text-muted-foreground">
                {room.features ? room.features.split(',').slice(0, 2).join(', ') : 'No features listed'}
                {room.features && room.features.split(',').length > 2 && '...'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg text-green-600">₦{room.price?.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {room.features ? room.features.split(',').length : 0} features
              </p>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/rooms/${room.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/rooms/${room.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Room
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Room
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the room
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteRoom(room.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )

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
        title="Room Management"
        description="Manage accommodation rooms and assignments"
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>All Rooms ({totalItems})</CardTitle>
              <CardDescription>
                Manage room listings, availability, and assignments
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link href="/admin/rooms/add">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1 sm:flex-none">Search</Button>
              {searchTerm && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    fetchRooms(1, '')
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Search works with room titles and descriptions
          </p>
          
          {/* Search Results Summary */}
          {searchTerm && !loading && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Search results for "{searchTerm}": {totalItems} room{totalItems !== 1 ? 's' : ''} found
                {totalItems > 0 && (
                  <span className="ml-2">
                    (showing page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>
          )}

          {loading ? (
            <div className={viewMode === 'grid' ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {Array.from({ length: 6 }).map((_, i) => (
                viewMode === 'grid' ? (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-gray-200 animate-pulse" />
                    <CardHeader>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                      </div>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card key={i} className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  </Card>
                )
              ))}
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <RoomListCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </>
          )}

          {rooms.length === 0 && !loading && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No rooms found' : 'No rooms available'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No rooms match your search for "${searchTerm}". Try adjusting your search terms.`
                  : 'Get started by adding your first room.'
                }
              </p>
              {searchTerm ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    fetchRooms(1, '')
                  }}
                >
                  Clear Search
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/admin/rooms/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room
                  </Link>
                </Button>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-6">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchRooms(currentPage - 1, searchTerm)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchRooms(currentPage + 1, searchTerm)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
