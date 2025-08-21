"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Wallet, CreditCard, Building, RefreshCw, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function WalletPage() {
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [balance, setBalance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchBalance = async () => {
    setLoading(true)
    try {
      admin.wallet.balance({
        onSuccess: (data) => {
          setBalance(data.data)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch wallet balance",
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
    fetchBalance()
  }, [])

  const formatBalance = (amount: number) => {
    // Convert from kobo to naira
    return (amount / 100).toLocaleString()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Wallet Management" 
        description="Monitor Paystack balance and manage transfers"
      />
      
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paystack Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-xl md:text-2xl font-bold text-green-600">
              {loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
              ) : (
                `₦${balance ? formatBalance(balance.balance) : '0'}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for transfers and refunds
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchBalance}
              className="mt-2"
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currency</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-xl md:text-2xl font-bold">
              {balance?.currency || 'NGN'}
            </div>
            <p className="text-xs text-muted-foreground">
              Nigerian Naira
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-xl md:text-2xl font-bold text-green-600">
              Active
            </div>
            <p className="text-xs text-muted-foreground">
              Payment gateway operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Bank Management
            </CardTitle>
            <CardDescription>
              View available banks for transfers and refunds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access the complete list of supported banks for processing refunds and transfers.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/wallet/banks">
                <Building className="mr-2 h-4 w-4" />
                View Bank List
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Transfer Management
            </CardTitle>
            <CardDescription>
              Process refunds and manage transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage refund transfers and view transfer history.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/transactions/refunds">
                <RefreshCw className="mr-2 h-4 w-4" />
                Manage Transfers
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
          <CardDescription>
            Important information about your Paystack wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Balance Updates</h4>
              <p className="text-sm text-muted-foreground">
                Your wallet balance is updated in real-time when payments are received. 
                The balance shown is available for immediate transfers and refunds.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Transfer Limits</h4>
              <p className="text-sm text-muted-foreground">
                Minimum transfer amount is ₦100. All transfers are subject to 
                Paystack's terms and conditions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Processing Time</h4>
              <p className="text-sm text-muted-foreground">
                Transfers typically process within 24 hours during business days. 
                Weekend transfers may take longer to complete.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Security</h4>
              <p className="text-sm text-muted-foreground">
                All transfers require admin password confirmation for security. 
                Keep your admin credentials secure at all times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
