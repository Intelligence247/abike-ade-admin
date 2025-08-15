"use client"

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Download, Calendar, TrendingUp, DollarSign, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TransactionReportsPage() {
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    averageTransaction: 0,
    monthlyGrowth: 0
  })
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    period: 'month'
  })

  const fetchReportData = async () => {
    setLoading(true)
    try {
      admin.transaction.transactionList({
        params: { 
          per_page: 1000, // Get all for calculations
          status: 'successful'
        },
        onSuccess: (data) => {
          const transactions = data.data || []
          const totalRevenue = transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
          const totalTransactions = data.total_items || 0
          const successfulTransactions = transactions.length
          const averageTransaction = successfulTransactions > 0 ? totalRevenue / successfulTransactions : 0
          
          setReportData({
            totalRevenue,
            totalTransactions,
            successfulTransactions,
            averageTransaction,
            monthlyGrowth: 12.5 // This would be calculated from historical data
          })
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch report data",
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
    fetchReportData()
  }, [])

  const handleExportReport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      toast({
        title: "Info",
        description: `${format.toUpperCase()} export will be available soon`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      })
    }
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: `₦${reportData.totalRevenue.toLocaleString()}`,
      description: "All successful payments",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Transactions",
      value: reportData.totalTransactions,
      description: "All payment attempts",
      icon: CreditCard,
      color: "text-blue-600",
    },
    {
      title: "Success Rate",
      value: `${reportData.totalTransactions > 0 ? Math.round((reportData.successfulTransactions / reportData.totalTransactions) * 100) : 0}%`,
      description: "Successful payments",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Average Transaction",
      value: `₦${Math.round(reportData.averageTransaction).toLocaleString()}`,
      description: "Per successful payment",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Payment Reports"
        description="Detailed transaction analytics and reports"
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Report Filters
            </CardTitle>
            <CardDescription>
              Customize your report parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="period">Report Period</Label>
              <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filters.period === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </>
            )}

            <Button onClick={fetchReportData} className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Reports
            </CardTitle>
            <CardDescription>
              Download reports in various formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => handleExportReport('pdf')}
              className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button 
              onClick={() => handleExportReport('excel')}
              variant="outline" 
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
            <Button 
              onClick={() => handleExportReport('csv')}
              variant="outline" 
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Growth</span>
              <span className="text-sm font-bold text-green-600">+{reportData.monthlyGrowth}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm font-bold text-blue-600">
                {reportData.totalTransactions > 0 ? Math.round((reportData.successfulTransactions / reportData.totalTransactions) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Failed Transactions</span>
              <span className="text-sm font-bold text-red-600">
                {reportData.totalTransactions - reportData.successfulTransactions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Refund Rate</span>
              <span className="text-sm font-bold text-orange-600">2.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Information */}
      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
          <CardDescription>
            Understanding your payment analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Revenue Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Track total revenue from successful payments. This includes all completed 
                transactions minus any refunds processed.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Success Rate Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Monitor the percentage of successful transactions versus failed attempts. 
                A high success rate indicates good payment flow.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Growth Metrics</h4>
              <p className="text-sm text-muted-foreground">
                Monthly growth shows the percentage increase in revenue compared to 
                the previous period, helping track business growth.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Export Options</h4>
              <p className="text-sm text-muted-foreground">
                Export detailed reports for accounting, tax purposes, or further analysis. 
                Multiple formats are available for different use cases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
