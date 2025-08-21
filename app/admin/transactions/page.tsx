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
import { Search, Download, Filter, CreditCard, TrendingUp, DollarSign, RefreshCw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export default function TransactionsPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [stats, setStats] = useState({
    totalAmount: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0
  })

  const fetchTransactions = async (page = 1, search = '', status = '') => {
    setLoading(true)
    
    try {
      const params: any = {
        page,
        per_page: 20,
        sort_by: '-date'
      }
      
      if (search && search.trim()) params.search = search.trim()
      if (status && status.trim()) params.status = status.trim()

      admin.transaction.transactionList({
        params,
        onSuccess: (data: any) => {
          
          setTransactions(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          
          // Calculate stats
          const successful = data.data?.filter((t: any) => t.status === 'Successful') || []
          const pending = data.data?.filter((t: any) => t.status === 'Pending') || []
          const failed = data.data?.filter((t: any) => t.status === 'Failed') || []
          const totalAmount = successful.reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
          
          setStats({
            totalAmount,
            successfulCount: successful.length,
            pendingCount: pending.length,
            failedCount: failed.length
          })
          
          setLoading(false)
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: "Failed to fetch transactions",
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
      fetchTransactions(1, '', '')
    }
  }, [adminLoading, admin])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset to page 1 when searching
    setCurrentPage(1)
    
    fetchTransactions(1, searchTerm, statusFilter === 'all' ? '' : statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    fetchTransactions(1, searchTerm, status === 'all' ? '' : status)
  }

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

  const statsCards = [
    {
      title: "Total Revenue",
      value: `₦${stats.totalAmount.toLocaleString()}`,
      description: "From successful transactions",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Successful",
      value: stats.successfulCount,
      description: "Completed payments",
      icon: CreditCard,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pendingCount,
      description: "Awaiting confirmation",
      icon: RefreshCw,
      color: "text-yellow-600",
    },
    {
      title: "Failed",
      value: stats.failedCount,
      description: "Unsuccessful payments",
      icon: TrendingUp,
      color: "text-red-600",
    },
  ]

  // Show loading state while admin is initializing
  if (adminLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Transaction Management" 
        description="Monitor and manage all payment transactions"
      />
      
      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-xl md:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>All Transactions ({totalItems})</CardTitle>
              <CardDescription>
                Monitor payment transactions and their status
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2">
              <Button asChild variant="outline">
                <Link href="/admin/transactions/refunds">
                  View Refunds
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-6">
            <form onSubmit={handleSearch} className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by transaction reference only..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 sm:flex-none">
                  Search
                </Button>
                {searchTerm && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      fetchTransactions(1, '', '')
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <p className="text-xs text-muted-foreground">
                Note: Search only works with transaction reference numbers (e.g., THECOURT_123...)
              </p>
              
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Search Results Summary */}
          {searchTerm && !loading && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Search results for "{searchTerm}": {totalItems} transaction{totalItems !== 1 ? 's' : ''} found
                {totalItems > 0 && (
                  <span className="ml-2">
                    (showing page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            </div>
          )}
          
          {transactions.length === 0 && !loading && (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm ? 'No transactions found' : 'No transactions available'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm 
                  ? `No transactions match your search for "${searchTerm}". Try adjusting your search terms or filters.`
                  : 'There are currently no transactions in the system.'
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    fetchTransactions(1, '', '')
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
          
          {transactions.length > 0 && (
            <DataTable
              data={transactions}
              columns={columns}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                fetchTransactions(page, searchTerm, statusFilter === 'all' ? '' : statusFilter)
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
