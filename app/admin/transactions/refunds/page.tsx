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
import { Search, ArrowLeft, Plus, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { Textarea } from '@/components/ui/textarea'

export default function RefundsPage() {
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [refunds, setRefunds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [initiateDialogOpen, setInitiateDialogOpen] = useState(false)
  const [refundForm, setRefundForm] = useState({
    reference: '',
    amount: '',
    account_number: '',
    account_name: '',
    bank_code: '',
    password: ''
  })

  const fetchRefunds = async (page = 1, search = '') => {
    setLoading(true)
    try {
      admin.transaction.refundList({
        params: {
          page,
          per_page: 20,
          search,
          sort_by: '-date'
        },
        onSuccess: (data) => {
          setRefunds(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch refunds",
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
    fetchRefunds()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRefunds(1, searchTerm)
  }

  const handleInitiateRefund = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      admin.transaction.initiateRefund({
        formData: {
          reference: refundForm.reference,
          amount: parseInt(refundForm.amount),
          account_number: refundForm.account_number,
          account_name: refundForm.account_name,
          bank_code: refundForm.bank_code
        },
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: "Refund initiated successfully",
          })
          setInitiateDialogOpen(false)
          setRefundForm({
            reference: '',
            amount: '',
            account_number: '',
            account_name: '',
            bank_code: '',
            password: ''
          })
          fetchRefunds()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to initiate refund",
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

  const handleMakeTransfer = async (refundReference: string) => {
    const password = prompt("Enter your admin password to authorize this transfer:")
    if (!password) return

    try {
      admin.transaction.makeTransfer({
        formData: {
          reference: refundReference,
          password
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Transfer initiated successfully",
          })
          fetchRefunds()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to make transfer",
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

  const columns = [
    {
      header: "Reference",
      cell: (refund: any) => (
        <div>
          <span className="font-mono text-sm">{refund.reference}</span>
          <p className="text-xs text-muted-foreground">{refund.description}</p>
        </div>
      )
    },
    {
      header: "Original Transaction",
      cell: (refund: any) => (
        <div>
          <span className="font-mono text-xs">{refund.transaction?.reference}</span>
          <p className="text-xs text-muted-foreground">
            ₦{refund.transaction?.amount?.toLocaleString()}
          </p>
        </div>
      )
    },
    {
      header: "Refund Amount",
      cell: (refund: any) => (
        <span className="font-semibold text-orange-600">
          ₦{refund.amount?.toLocaleString()}
        </span>
      )
    },
    {
      header: "Recipient",
      cell: (refund: any) => (
        <div>
          <p className="font-medium">{refund.details?.destination_account_name}</p>
          <p className="text-xs text-muted-foreground">
            {refund.details?.destination_account_number}
          </p>
          <p className="text-xs text-muted-foreground">
            {refund.details?.destination_bank_name}
          </p>
        </div>
      )
    },
    {
      header: "Status",
      cell: (refund: any) => {
        const getStatusVariant = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'success': return 'default'
            case 'unpaid': return 'secondary'
            case 'failed': return 'destructive'
            case 'pending': return 'outline'
            default: return 'secondary'
          }
        }
        
        return (
          <Badge variant={getStatusVariant(refund.status)}>
            {refund.status}
          </Badge>
        )
      }
    },
    {
      header: "Date",
      cell: (refund: any) => {
        const date = refund.date ? new Date(refund.date) : null
        return date ? date.toLocaleDateString() : 'N/A'
      }
    },
    {
      header: "Actions",
      cell: (refund: any) => (
        refund.status === 'unpaid' ? (
          <Button
            size="sm"
            onClick={() => handleMakeTransfer(refund.reference)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Send className="mr-1 h-3 w-3" />
            Send
          </Button>
        ) : null
      )
    }
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <AdminHeader 
          title="Refund Management" 
          description="Manage refund requests and transfers"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Refunds ({totalItems})</CardTitle>
              <CardDescription>
                Monitor and process refund requests
              </CardDescription>
            </div>
            <Dialog open={initiateDialogOpen} onOpenChange={setInitiateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Initiate Refund
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Initiate Refund</DialogTitle>
                  <DialogDescription>
                    Create a new refund request for a transaction
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInitiateRefund} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Transaction Reference</Label>
                    <Input
                      id="reference"
                      value={refundForm.reference}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, reference: e.target.value }))}
                      placeholder="THECOURT_12345678909876543"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Refund Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={refundForm.amount}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="100000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      value={refundForm.account_number}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, account_number: e.target.value }))}
                      placeholder="1234567890"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_name">Account Name</Label>
                    <Input
                      id="account_name"
                      value={refundForm.account_name}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, account_name: e.target.value }))}
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_code">Bank Code</Label>
                    <Input
                      id="bank_code"
                      value={refundForm.bank_code}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, bank_code: e.target.value }))}
                      placeholder="999992"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setInitiateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Initiate Refund
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
                placeholder="Search refunds by reference or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <DataTable
            data={refunds}
            columns={columns}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchRefunds(page, searchTerm)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
