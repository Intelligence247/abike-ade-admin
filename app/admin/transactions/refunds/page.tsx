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
import { Search, ArrowLeft, Plus, Send, Loader2 } from 'lucide-react'
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectLabel,
  SelectGroup
} from '@/components/ui/select'

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
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [selectedRefund, setSelectedRefund] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [banks, setBanks] = useState<any[]>([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [verifyingAccount, setVerifyingAccount] = useState(false)
  const [refundForm, setRefundForm] = useState({
    reference: '',
    amount: '',
    account_number: '',
    account_name: '',
    bank_code: ''
  })
  const [transferForm, setTransferForm] = useState({
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
        onSuccess: (data: any) => {
          setRefunds(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error: any) => {
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

  // Load transactions and banks when opening the initiate dialog
  useEffect(() => {
    if (!initiateDialogOpen || !admin) return

    // Fetch recent transactions (first page, larger per_page for convenience)
    setTransactionsLoading(true)
    try {
      admin.transaction.transactionList({
        params: { per_page: 50, sort_by: '-date' },
        onSuccess: (data: any) => {
          setTransactions(Array.isArray(data.data) ? data.data : [])
          setTransactionsLoading(false)
        },
        onError: () => {
          setTransactions([])
          setTransactionsLoading(false)
        }
      })
    } catch {
      setTransactionsLoading(false)
    }

    // Fetch bank list
    setBanksLoading(true)
    try {
      admin.wallet.bankList({
        onSuccess: (data: any) => {
          setBanks(Array.isArray(data.data) ? data.data : [])
          setBanksLoading(false)
        },
        onError: () => {
          setBanks([])
          setBanksLoading(false)
        }
      })
    } catch {
      setBanksLoading(false)
    }
  }, [initiateDialogOpen, admin])

  // Auto-verify account name when bank_code and 10-digit account_number are present
  useEffect(() => {
    const acct = refundForm.account_number?.trim()
    const bank = refundForm.bank_code?.trim()
    if (!initiateDialogOpen || !admin || !bank || !acct || acct.length !== 10) return

    setVerifyingAccount(true)
    try {
      admin.wallet.verifyAccount({
        params: { account_number: acct, bank_code: bank },
        onSuccess: (data: any) => {
          const name = data?.data?.account_name || ''
          setRefundForm(prev => ({ ...prev, account_name: name }))
          setVerifyingAccount(false)
        },
        onError: (error: any) => {
          setVerifyingAccount(false)
          setRefundForm(prev => ({ ...prev, account_name: '' }))
          toast({
            title: 'Account verification failed',
            description: error?.message || 'Could not verify account details',
            variant: 'destructive',
          })
        }
      })
    } catch {
      setVerifyingAccount(false)
    }
  }, [refundForm.account_number, refundForm.bank_code, initiateDialogOpen, admin, toast])

  const handleSelectTransaction = (transactionId: string) => {
    const tx = transactions.find((t) => String(t.id) === String(transactionId))
    if (tx) {
      // API requires the transaction reference
      setRefundForm(prev => ({ ...prev, reference: tx.reference, amount: prev.amount || String(tx.amount || '') }))
    }
  }

  const handleSelectBank = (bankCode: string) => {
    setRefundForm(prev => ({ ...prev, bank_code: bankCode }))
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
    
    // Validate amount (must be at least ₦100)
    const amount = parseInt(refundForm.amount)
    if (amount < 100) {
      toast({
        title: "Error",
        description: "Refund amount must be at least ₦100",
        variant: "destructive",
      })
      return
    }
    
    // Check if refund already exists for this transaction
    const existingRefund = refunds.find(refund => 
      refund.transaction?.reference === refundForm.reference
    )
    
    if (existingRefund) {
      toast({
        title: "Error",
        description: "A refund already exists for this transaction",
        variant: "destructive",
      })
      return
    }
    
    try {
      admin.transaction.initiateRefund({
        formData: {
          reference: refundForm.reference,
          amount: amount,
          account_number: refundForm.account_number,
          account_name: refundForm.account_name,
          bank_code: refundForm.bank_code
        },
        onSuccess: (data: any) => {
          if (data.status === 'success') {
            // Step 1 successful - now proceed to Step 2: Make Transfer
            const refundReference = data.data?.reference
            if (refundReference) {
              // Store the refund reference for the transfer step
              setSelectedRefund({
                reference: refundReference,
                amount: amount,
                account_name: refundForm.account_name,
                account_number: refundForm.account_number
              })
              
              // Close the initiate dialog and open the transfer dialog
              setInitiateDialogOpen(false)
              setTransferDialogOpen(true)
              
              // Show success message for Step 1
              toast({
                title: "Step 1 Complete",
                description: "Refund initiated successfully. Now enter your password to complete the transfer.",
              })
            } else {
              toast({
                title: "Error",
                description: "Refund initiated but no reference returned",
                variant: "destructive",
              })
            }
          } else {
            // Handle error response with 200 status
            toast({
              title: "Error",
              description: data.message || "Failed to initiate refund",
              variant: "destructive",
            })
          }
        },
        onError: (error: any) => {
          // Handle specific error cases
          let errorMessage = "Failed to initiate refund"
          
          if (error.message) {
            if (error.message.includes("Invalid transaction reference")) {
              errorMessage = "Invalid transaction reference. Please check the reference number."
            } else if (error.message.includes("Invalid bank code")) {
              errorMessage = "Invalid bank code provided. Please verify the bank code."
            } else if (error.message.includes("unsuccessful transactions")) {
              errorMessage = "Refund cannot be made on unsuccessful transactions."
            } else if (error.message.includes("greater than rent amount")) {
              errorMessage = "Refund amount cannot be greater than the original rent amount."
            } else if (error.message.includes("expired rent")) {
              errorMessage = "Refund cannot be made on expired rent."
            } else if (error.message.includes("less than 100")) {
              errorMessage = "Refund amount must be at least ₦100."
            } else if (error.message.includes("UNIQUE constraint failed")) {
              errorMessage = "A refund already exists for this transaction."
            } else {
              errorMessage = error.message
            }
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleMakeTransfer = async (refundReference: any) => {
    setSelectedRefund(refundReference)
    setTransferDialogOpen(true)
  }

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRefund) {
      toast({
        title: "Error",
        description: "No refund selected for transfer",
        variant: "destructive",
      })
      return
    }
    
    if (!transferForm.password) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      })
      return
    }
    
    try {
      admin.transaction.makeTransfer({
        formData: {
          reference: selectedRefund.reference,
          password: transferForm.password
        },
        onSuccess: (data: any) => {
          if (data.status === 'success') {
            toast({
              title: "Success",
              description: data.message || "Refund transfer completed successfully",
            })
            
            // Close the transfer dialog
            setTransferDialogOpen(false)
            
            // Reset forms
            setRefundForm({
              reference: '',
              amount: '',
              account_number: '',
              account_name: '',
              bank_code: ''
            })
            setTransferForm({ password: '' })
            setSelectedRefund(null)
            
            // Refresh the refunds list to show the new refund
            fetchRefunds()
          } else {
            // Handle error response with 200 status
            toast({
              title: "Error",
              description: data.message || "Failed to complete transfer",
              variant: "destructive",
            })
          }
        },
        onError: (error: any) => {
          // Handle specific error cases
          let errorMessage = "Failed to complete transfer"
          
          if (error.message) {
            if (error.message.includes("Invalid transfer reference")) {
              errorMessage = "Invalid transfer reference. Please try initiating the refund again."
            } else if (error.message.includes("Invalid password")) {
              errorMessage = "Invalid password. Please check your admin password."
            } else if (error.message.includes("Incorrect password")) {
              errorMessage = "Incorrect password. Please check your admin password."
            } else if (error.message.includes("third party payouts")) {
              errorMessage = "Third party payouts are currently disabled."
            } else if (error.message.includes("UNIQUE constraint failed")) {
              errorMessage = "Transfer already exists for this refund."
            } else {
              errorMessage = error.message
            }
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      })
    } catch (error: any) {
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
            onClick={() => handleMakeTransfer(refund)}
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
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
                    <Label>Transaction</Label>
                    <Select onValueChange={handleSelectTransaction}>
                      <SelectTrigger>
                        <SelectValue placeholder={transactionsLoading ? 'Loading transactions...' : (refundForm.reference ? 'Transaction selected' : 'Select transaction by student')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Recent Transactions</SelectLabel>
                          {transactions.map((tx: any) => (
                            <SelectItem key={tx.id} value={String(tx.id)}>
                              {`${tx.student?.first_name || ''} ${tx.student?.last_name || ''}`.trim() || 'Unknown'}
                              {tx.student?.email ? ` • ${tx.student.email}` : ''}
                              {tx.reference ? ` • ${tx.reference}` : ''}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {refundForm.reference && (
                      <p className="text-xs text-muted-foreground">Selected reference: <span className="font-mono">{refundForm.reference}</span></p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Refund Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={refundForm.amount}
                      onChange={(e) => setRefundForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="100000"
                      min="100"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum amount: ₦100
                    </p>
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
                    <Label>Bank</Label>
                    <Select onValueChange={handleSelectBank}>
                      <SelectTrigger>
                        <SelectValue placeholder={banksLoading ? 'Loading banks...' : (refundForm.bank_code ? 'Bank selected' : 'Select bank')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Banks</SelectLabel>
                          {banks.map((b: any) => (
                            <SelectItem key={b.bankCode} value={String(b.bankCode)}>
                              {b.bankName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {refundForm.bank_code && (
                      <p className="text-xs text-muted-foreground">Selected bank code: {refundForm.bank_code}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_name">Account Name</Label>
                    <div className="relative">
                      <Input
                        id="account_name"
                        value={refundForm.account_name}
                        placeholder={verifyingAccount ? 'Verifying...' : 'Auto-filled after verification'}
                        readOnly
                        required
                      />
                      {verifyingAccount && (
                        <Loader2 className="absolute right-2 top-2 h-5 w-5 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Account name is auto-filled after verifying the account number and bank.</p>
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fetchRefunds()}
            >
              Refresh
            </Button>
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



      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Refund Transfer (Step 2)</DialogTitle>
            <DialogDescription>
              Enter your admin password to complete the refund transfer
            </DialogDescription>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-blue-800 mb-2">Refund Details:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Refund Reference:</strong> {selectedRefund.reference}</p>
                <p><strong>Amount:</strong> ₦{selectedRefund.amount?.toLocaleString()}</p>
                <p><strong>Recipient:</strong> {selectedRefund.account_name}</p>
                <p><strong>Account:</strong> {selectedRefund.account_number}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={transferForm.password}
                onChange={(e) => setTransferForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your admin password"
                required
              />
              <p className="text-xs text-muted-foreground">
                This password is required to authorize the refund transfer
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTransferDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Complete Transfer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
