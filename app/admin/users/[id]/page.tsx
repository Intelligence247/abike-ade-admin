"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
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
          <h2 className="text-xl md:text-2xl font-bold">User not found</h2>
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
      <PageHeader
        title={`${user.first_name} ${user.last_name}`}
        description="User details and transaction history"
      />

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.image}`}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                )}
                {user.verified && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                    <UserCheck className="h-3 w-3 text-white" />
                  </div>
                )}
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

            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
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

            {/* Account Information */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Account Information
              </h4>
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span className="font-medium">Account Status:</span>
                  <Badge variant={user.user.is_active ? 'default' : 'secondary'}>
                    {user.user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span className="font-medium">Verification Status:</span>
                  <Badge variant={user.verified ? 'default' : 'secondary'}>
                    {user.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span className="font-medium">Username:</span>
                  <span className="font-mono">@{user.user.username}</span>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span className="font-medium">User ID:</span>
                  <span className="font-mono">#{user.id}</span>
                </div>
              </div>
            </div>

            {/* Verification Documents Section */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Verification Documents
                </h4>
                <Badge variant="outline" className="text-xs">
                  Required for verification
                </Badge>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Users must upload both the student agreement and identity verification documents before they can be verified by an administrator.
                </p>
              </div>
              
              {/* Agreement Document */}
              <div className="p-4 border rounded-lg">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Student Agreement</h5>
                      <p className="text-sm text-muted-foreground">
                        {user.agreement ? 'Document uploaded' : 'No document uploaded'}
                      </p>
                      {user.agreement && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {user.agreement.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                  {user.agreement && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL + "" + user.agreement, '_blank')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = process.env.NEXT_PUBLIC_API_URL + "" + user.agreement
                          link.download = `agreement_${user.first_name}_${user.last_name}.pdf`
                          link.click()
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Identity Document */}
              <div className="p-4 border rounded-lg">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Identity Verification</h5>
                      <p className="text-sm text-muted-foreground">
                        {user.identity ? 'Document uploaded' : 'Not provided'}
                      </p>
                      {user.identity && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {user.identity.split('/').pop()}
                        </p>
                      )}
                    </div>
                  </div>
                  {user.identity && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL + "" + user.identity, '_blank')}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = process.env.NEXT_PUBLIC_API_URL + "" + user.identity
                          link.download = `identity_${user.first_name}_${user.last_name}.pdf`
                          link.click()
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${user.verified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {user.verified ? (
                        <UserCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium">Verification Status</h5>
                      <p className="text-sm text-muted-foreground">
                        {user.verified ? 'User has been verified' : 'User requires verification'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={user.verified ? 'default' : 'secondary'}>
                    {user.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
              </div>

              {/* Verification Requirements */}
              {!user.verified && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">Verification Requirements</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Student agreement document must be uploaded</li>
                    <li>• Identity verification document is recommended</li>
                    <li>• Admin must review documents before verification</li>
                    <li>• User account will be marked as verified upon approval</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage user account and verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!user.verified && (
              <>
                <Button
                  onClick={() => handleUserAction('verify')}
                  className="w-full justify-start"
                  disabled={!user.agreement}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Verify User
                </Button>
                {!user.agreement && (
                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ User must upload agreement before verification
                  </p>
                )}
                {user.agreement && (
                  <p className="text-xs text-green-600 text-center">
                    ✅ Ready for verification
                  </p>
                )}
              </>
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

            {/* Document Status Summary */}
            <div className="pt-3 border-t">
              <h4 className="text-sm font-medium mb-2">Document Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span>Agreement:</span>
                  <Badge variant={user.agreement ? 'default' : 'secondary'} className="text-xs">
                    {user.agreement ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span>Identity:</span>
                  <Badge variant={user.identity ? 'default' : 'secondary'} className="text-xs">
                    {user.identity ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <span>Verification:</span>
                  <Badge variant={user.verified ? 'default' : 'secondary'} className="text-xs">
                    {user.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
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
