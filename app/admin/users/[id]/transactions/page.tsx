"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, DollarSign, Calendar, Building, User, Shield } from 'lucide-react'
import Link from 'next/link'

export default function UserTransactionsPage() {
  const params = useParams()
  const router = useRouter()
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const userId = params.id as string

  const fetchUser = async () => {
    try {
      admin.user.userList({
        params: { user_id: parseInt(userId) },
        onSuccess: (data) => {
          setUser(data.data)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch user details",
            variant: "destructive",
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      })
    }
  }

  const fetchTransactions = async (page = 1) => {
    setLoading(true)
    try {
      admin.user.userTransactions({
        params: { user_id: parseInt(userId) },
        onSuccess: (data) => {
          setTransactions(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch user transactions",
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
    if (!adminLoading && admin) {
      fetchUser()
      fetchTransactions()
    }
  }, [adminLoading, admin, userId])

  const columns = [
    {
      header: "Reference",
      cell: (transaction: any) => (
        <div>
          <span className="font-mono text-sm">{transaction.reference}</span>
          <p className="text-xs text-muted-foreground">{transaction.description}</p>
        </div>
      )
    },
    {
      header: "Room",
      cell: (transaction: any) => transaction.room?.title || 'N/A'
    },
    {
      header: "Amount",
      cell: (transaction: any) => (
        <span className="font-semibold text-green-600">
          ₦{transaction.amount?.toLocaleString()}
        </span>
      )
    },
    {
      header: "Status",
      cell: (transaction: any) => {
        const getStatusVariant = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'successful': return 'default'
            case 'pending': return 'secondary'
            case 'failed': return 'destructive'
            case 'refunded': return 'outline'
            default: return 'secondary'
          }
        }
        
        return (
          <Badge variant={getStatusVariant(transaction.status)}>
            {transaction.status}
          </Badge>
        )
      }
    },
    {
      header: "Date",
      cell: (transaction: any) => {
        const date = transaction.date ? new Date(transaction.date) : null
        return date ? date.toLocaleDateString() : 'N/A'
      }
    },
    {
      header: "Duration",
      cell: (transaction: any) => `${transaction.duration || 0} months`
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

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            User not found
          </h3>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="User Transactions" 
        description={`Transaction history for ${user.first_name} ${user.last_name}`}
      />
      
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.first_name} {user.last_name}</CardTitle>
                <CardDescription className="text-lg">{user.email}</CardDescription>
                {user.phone_number && (
                  <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                )}
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={user.user?.is_active ? 'default' : 'secondary'}>
                {user.user?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Verified:</span>
              <Badge variant={user.verified ? 'default' : 'outline'}>
                {user.verified ? 'Yes' : 'No'}
              </Badge>
            </div>
            {user.institution && (
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.institution}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History ({totalItems})</CardTitle>
              <CardDescription>
                All payment transactions for this user
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 && !loading && (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No transactions found
              </h3>
              <p className="text-sm text-muted-foreground">
                This user hasn't made any transactions yet.
              </p>
            </div>
          )}
          
          {transactions.length > 0 && (
            <DataTable
              data={transactions}
              columns={columns}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchTransactions(page)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
