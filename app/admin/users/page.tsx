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
import { Search, UserPlus, Eye, UserCheck, UserX, Shield, User } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export default function UsersPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true)
    try {
      admin.user.userList({
        params: {
          page,
          per_page: 20,
          search,
          sort_by: 'first_name'
        },
        onSuccess: (data) => {
          console.log('User list API response:', data)
          console.log('Users data:', data.data)
          console.log('Verification statuses:', data.data?.map((u: any) => ({
            id: u.id,
            verified: u.verified,
            user_verified: u.user?.verified,
            is_verified: u.is_verified,
            verification_status: u.verification_status,
            name: `${u.first_name} ${u.last_name}`
          })))

          setUsers(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch users",
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
      fetchUsers()
    }
  }, [adminLoading, admin])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers(1, searchTerm)
  }

  const handleUserAction = async (userId: number, action: 'activate' | 'deactivate' | 'verify' | 'verifyAgreement') => {
    try {
      if (action === 'verify') {
        console.log('Verifying user:', userId)
        admin.user.verify({
          formData: { user_id: userId },
          onSuccess: (data) => {
            console.log('Verify API response:', data)
            toast({
              title: "Success",
              description: "User verified successfully",
            })
            // Force refresh the user data to get updated verification status
            setTimeout(() => {
              console.log('Refreshing user data after verification')
              fetchUsers(currentPage, searchTerm)
            }, 500)
          },
          onError: (error) => {
            console.error('Verify API error:', error)
            toast({
              title: "Error",
              description: error.message || "Failed to verify user",
              variant: "destructive",
            })
          }
        })
      } else if (action === 'verifyAgreement') {
        admin.user.verifyAgreement({
          formData: { user_id: userId },
          onSuccess: () => {
            toast({
              title: "Success",
              description: "User agreement verified successfully",
            })
            fetchUsers(currentPage, searchTerm)
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to verify user agreement",
              variant: "destructive",
            })
          }
        })
      } else {
        admin.user.userStatus({
          formData: { user_id: userId, action },
          onSuccess: () => {
            toast({
              title: "Success",
              description: `User ${action}d successfully`,
            })
            fetchUsers(currentPage, searchTerm)
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || `Failed to ${action} user`,
              variant: "destructive",
            })
          }
        })
      }
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
      header: "User",
      cell: (user: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div>
            <p className="font-medium">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Phone",
      cell: (user: any) => user.phone_number || 'Not provided'
    },
    {
      header: "Institution",
      cell: (user: any) => user.institution || 'Not provided'
    },
    {
      header: "Last Login",
      cell: (user: any) => {
        if (!user.user.last_login) return 'Never'
        const date = new Date(user.user.last_login)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
      }
    },
    {
      header: "Status",
      cell: (user: any) => (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Badge variant={user.user.is_active ? 'default' : 'secondary'}>
              {user.user.is_active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant={user.verified ? 'default' : 'outline'}>
              {user.verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          {user.agreement && (
            <Badge variant="outline" className="text-xs">
              Agreement: {process.env.NEXT_PUBLIC_API_URL + "" + user.agreement_verified ? 'Verified' : 'Pending'}
            </Badge>
          )}
        </div>
      )
    },
    {
      header: "Actions",
      cell: (user: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/transactions`}>
                <Eye className="mr-2 h-4 w-4" />
                View Transactions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!user.verified && (
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'verify')}>
                <Shield className="mr-2 h-4 w-4" />
                Verify User
              </DropdownMenuItem>
            )}
            {user.agreement && (
              <>
                <DropdownMenuItem asChild>
                  <a href={process.env.NEXT_PUBLIC_API_URL + user.agreement} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Agreement
                  </a>
                </DropdownMenuItem>
                {!user.agreement_verified && (
                  <DropdownMenuItem onClick={() => handleUserAction(user.id, 'verifyAgreement')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Agreement
                  </DropdownMenuItem>
                )}
              </>
            )}
            <DropdownMenuItem
              onClick={() => handleUserAction(user.id, user.user.is_active ? 'deactivate' : 'activate')}
            >
              {user.user.is_active ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        title="User Management"
        description="Manage student accounts and registrations"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.user?.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.verified).length}
            </div>
            <p className="text-xs text-muted-foreground">Account verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => !u.verified).length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users ({totalItems})</CardTitle>
              <CardDescription>
                Manage student accounts, verify users, and handle registrations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Manual refresh clicked')
                  fetchUsers(currentPage, searchTerm)
                }}
              >
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, phone, or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchTerm && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  fetchUsers(1, '')
                }}
              >
                Clear
              </Button>
            )}
          </form>
          <p className="text-xs text-muted-foreground mt-1">
            Search works with first name, last name, email, phone number, institution, and department
          </p>

          {/* Search Results Summary */}
          {searchTerm && !loading && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Search results for "{searchTerm}": {totalItems} user{totalItems !== 1 ? 's' : ''} found
                {totalItems > 0 && (
                  <span className="ml-2">
                    (showing page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>
          )}

          {users.length === 0 && !loading && (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm ? 'No users found' : 'No users available'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? `No users match your search for "${searchTerm}". Try adjusting your search terms.`
                  : 'There are currently no users in the system.'
                }
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    fetchUsers(1, '')
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {users.length > 0 && (
            <DataTable
              data={users}
              columns={columns}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchUsers(page, searchTerm)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
