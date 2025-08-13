"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, User, Mail, Phone, School, FileText, CreditCard, Shield, UserCheck, UserX } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/admin/data-table'

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [transactionsLoading, setTransactionsLoading] = useState(true)

  const userId = params.id as string

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
      fetchUserTransactions()
    }
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      admin.user.userList({
        params: { user_id: parseInt(userId) },
        onSuccess: (data) => {
          setUser(data.data)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch user details",
            variant: "destructive",
          })
          setLoading(false)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchUserTransactions = async () => {
    try {
      admin.user.userTransactions({
        params: { user_id: parseInt(userId) },
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

  const handleUserAction = async (action: 'activate' | 'deactivate' | 'verify') => {
    try {
      if (action === 'verify') {
        admin.user.verify({
          formData: { user_id: parseInt(userId) },
          onSuccess: () => {
            toast({
              title: "Success",
              description: "User verified successfully",
            })
            fetchUserDetails()
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to verify user",
              variant: "destructive",
            })
          }
        })
      } else {
        admin.user.userStatus({
          formData: { user_id: parseInt(userId), action },
          onSuccess: () => {
            toast({
              title: "Success",
              description: `User ${action}d successfully`,
            })
            fetchUserDetails()
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

  const transactionColumns = [
    {
      header: "Reference",
      cell: (transaction: any) => (
        <span className="font-mono text-sm">{transaction.reference}</span>
      )
    },
    {
      header: "Description",
      cell: (transaction: any) => transaction.description
    },
    {
      header: "Room",
      cell: (transaction: any) => transaction.room?.title || 'N/A'
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

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
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
          title={`${user.first_name} ${user.last_name}`}
          description="User details and transaction history"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.first_name} {user.last_name}</h3>
                <p className="text-muted-foreground">@{user.user.username}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={user.user.is_active ? 'default' : 'secondary'}>
                    {user.user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant={user.verified ? 'default' : 'outline'}>
                    {user.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{user.phone_number || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Institution:</span>
                  <span className="text-sm">{user.institution || 'Not provided'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Department:</span>
                  <span className="text-sm">{user.department || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Level:</span>
                  <span className="text-sm">{user.level || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Last Login:</span>
                  <span className="text-sm">
                    {user.user.last_login ? new Date(user.user.last_login).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {user.agreement && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Agreement:</span>
                <a
                  href={process.env.NEXT_PUBLIC_API_URL + "" + user.agreement}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Document
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!user.verified && (
              <Button
                onClick={() => handleUserAction('verify')}
                className="w-full justify-start"
              >
                <Shield className="mr-2 h-4 w-4" />
                Verify User
              </Button>
            )}
            <Button
              onClick={() => handleUserAction(user.user.is_active ? 'deactivate' : 'activate')}
              variant={user.user.is_active ? 'destructive' : 'default'}
              className="w-full justify-start"
            >
              {user.user.is_active ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate User
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate User
                </>
              )}
            </Button>
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
            All payment transactions for this user
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
