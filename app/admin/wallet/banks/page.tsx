"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Search, ArrowLeft, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BankListPage() {
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [banks, setBanks] = useState<any[]>([])
  const [filteredBanks, setFilteredBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBanks = async () => {
    setLoading(true)
    try {
      admin.wallet.bankList({
        onSuccess: (data) => {
          setBanks(data.data || [])
          setFilteredBanks(data.data || [])
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch bank list",
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
    fetchBanks()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = banks.filter(bank => 
      bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.bankCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBanks(filtered)
  }

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBanks(banks)
    }
  }, [searchTerm, banks])

  const columns = [
    {
      header: "Bank Name",
      cell: (bank: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <Building className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{bank.bankName}</span>
        </div>
      )
    },
    {
      header: "Bank Code",
      cell: (bank: any) => (
        <span className="font-mono text-sm">{bank.bankCode}</span>
      )
    },
    {
      header: "Bank ID",
      cell: (bank: any) => (
        <span className="text-sm text-muted-foreground">{bank.bankId}</span>
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
          title="Bank List" 
          description="Available banks for transfers and refunds"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Nigerian Banks ({filteredBanks.length})</CardTitle>
              <CardDescription>
                Complete list of supported banks for Paystack transfers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search banks by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <DataTable
            data={filteredBanks}
            columns={columns}
            loading={loading}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use Bank Codes</CardTitle>
          <CardDescription>
            Important information about bank codes for transfers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">For Refunds</h4>
              <p className="text-sm text-muted-foreground">
                When initiating a refund, use the bank code from this list to ensure 
                the transfer goes to the correct bank. Always verify the account details 
                before processing.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Account Verification</h4>
              <p className="text-sm text-muted-foreground">
                Use the account verification feature to confirm account details 
                before making any transfers. This helps prevent errors and ensures 
                funds reach the intended recipient.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
