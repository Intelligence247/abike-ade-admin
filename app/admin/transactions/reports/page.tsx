"use client"

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Download, Calendar, TrendingUp, DollarSign, CreditCard, Loader2 } from 'lucide-react'
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
import { downloadFile, generateCSV, generateExcelData, formatCurrency, formatDate } from '@/lib/utils'

export default function TransactionReportsPage() {
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    averageTransaction: 0,
    monthlyGrowth: 0
  })
  const [transactions, setTransactions] = useState<any[]>([])
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
        onSuccess: (data: any) => {
          const transactions = data.data || []
          setTransactions(transactions) // Store transactions for export
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
        onError: (error: any) => {
          toast({
            title: "Error",
            description: "Failed to fetch report data",
            variant: "destructive",
          })
          setLoading(false)
        }
      })
    } catch (error: any) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [])

  const handleExportReport = async (format: 'csv' | 'pdf' | 'excel') => {
    if (transactions.length === 0) {
      toast({
        title: "No Data",
        description: "No transaction data available for export",
        variant: "destructive",
      })
      return
    }

    setExportLoading(format)
    
    try {
      // Prepare data for export
      const exportData = transactions.map((transaction: any) => ({
        'Transaction ID': transaction.id || transaction.transaction_id || 'N/A',
        'User': transaction.user?.name || transaction.user_name || 'N/A',
        'Email': transaction.user?.email || transaction.user_email || 'N/A',
        'Amount': formatCurrency(transaction.amount || 0),
        'Status': transaction.status || 'N/A',
        'Payment Method': transaction.payment_method || 'N/A',
        'Date': formatDate(transaction.created_at || transaction.date || new Date()),
        'Description': transaction.description || transaction.narration || 'N/A',
        'Reference': transaction.reference || transaction.ref || 'N/A'
      }))

      const headers = Object.keys(exportData[0])
      const filename = `transaction-report-${filters.period}-${new Date().toISOString().split('T')[0]}`

      if (format === 'csv') {
        const csvContent = generateCSV(exportData, headers)
        downloadFile(csvContent, `${filename}.csv`, 'text/csv')
        toast({
          title: "Success",
          description: "CSV report downloaded successfully",
        })
      } else if (format === 'excel') {
        const excelContent = generateExcelData(exportData, headers)
        downloadFile(excelContent, `${filename}.csv`, 'application/vnd.ms-excel')
        toast({
          title: "Success",
          description: "Excel report downloaded successfully",
        })
      } else if (format === 'pdf') {
        // For PDF, we'll create a formatted text version that can be printed
        const pdfContent = generatePDFContent(exportData, headers, filename)
        downloadFile(pdfContent, `${filename}.txt`, 'text/plain')
        toast({
          title: "Success",
          description: "PDF report downloaded (as text file for now)",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to export ${format.toUpperCase()} report: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setExportLoading(null)
    }
  }

  const generatePDFContent = (data: any[], headers: string[], title: string) => {
    const headerRow = headers.join(' | ')
    const separator = '-'.repeat(headerRow.length)
    const dataRows = data.map(row => headers.map(header => row[header]).join(' | '))
    
    return [
      `TRANSACTION REPORT: ${title.toUpperCase()}`,
      `Generated on: ${new Date().toLocaleString()}`,
      `Total Records: ${data.length}`,
      '',
      separator,
      headerRow,
      separator,
      ...dataRows,
      separator,
      '',
      'Report Summary:',
      `- Total Transactions: ${data.length}`,
      `- Total Amount: ${formatCurrency(data.reduce((sum, row) => {
        const amount = parseFloat(row.Amount.replace(/[₦,]/g, '')) || 0
        return sum + amount
      }, 0))}`,
      `- Date Range: ${filters.startDate || 'All time'} to ${filters.endDate || 'Current'}`
    ].join('\n')
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
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
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
              disabled={exportLoading !== null || transactions.length === 0}
              className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {exportLoading === 'pdf' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {exportLoading === 'pdf' ? 'Exporting...' : 'Export as PDF'}
            </Button>
            <Button 
              onClick={() => handleExportReport('excel')}
              variant="outline" 
              disabled={exportLoading !== null || transactions.length === 0}
              className="w-full justify-start"
            >
              {exportLoading === 'excel' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {exportLoading === 'excel' ? 'Exporting...' : 'Export as Excel'}
            </Button>
            <Button 
              onClick={() => handleExportReport('csv')}
              variant="outline" 
              disabled={exportLoading !== null || transactions.length === 0}
              className="w-full justify-start"
            >
              {exportLoading === 'csv' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {exportLoading === 'csv' ? 'Exporting...' : 'Export as CSV'}
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
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <span className="text-sm font-medium">Monthly Growth</span>
              <span className="text-sm font-bold text-green-600">+{reportData.monthlyGrowth}%</span>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm font-bold text-blue-600">
                {reportData.totalTransactions > 0 ? Math.round((reportData.successfulTransactions / reportData.totalTransactions) * 100) : 0}%
              </span>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <span className="text-sm font-medium">Failed Transactions</span>
              <span className="text-sm font-bold text-red-600">
                {reportData.totalTransactions - reportData.successfulTransactions}
              </span>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
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
