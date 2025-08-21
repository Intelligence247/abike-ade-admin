// "use client"

// import { Inter } from 'next/font/google'
// import { AdminProvider } from '@/components/admin/admin-provider'
// import { ThemeProvider } from '@/components/theme-provider'
// import { Toaster } from '@/components/ui/toaster'
// import { AdminSidebar } from '@/components/admin/admin-sidebar'
// import { useAdmin } from '@/components/admin/admin-provider'
// import { usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { Loader2, Menu } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import '@/app/globals.css'

// const inter = Inter({ 
//   subsets: ['latin'],
//   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
//   display: 'swap',
// })

// function AdminLayoutContent({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAdmin()
//   const pathname = usePathname()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   // Check if current page is login (don't show sidebar on login)
//   const isLoginPage = pathname === '/admin/login'



//   useEffect(() => {
//     if (!isLoading && !user && !isLoginPage) {
//       // Redirect to login if not authenticated and not already on login page
//       window.location.href = '/admin/login'
//     }
//   }, [user, isLoading, isLoginPage])

//   // Don't render sidebar on login page
//   if (isLoginPage) {
//     return <>{children}</>
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Mobile menu button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
//           aria-label="Toggle sidebar menu"
//         >
//           <Menu className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Sidebar */}
//       <AdminSidebar 
//         mobileOpen={sidebarOpen}
//         onMobileClose={() => setSidebarOpen(false)}
//       />

//       {/* Main content - with proper left margin for fixed sidebar */}
//       <div className={`flex-1 transition-all duration-300 lg:ml-64`}>
//         <div className="min-h-screen pt-20 lg:pt-0">
//           {children}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <AdminProvider>
//             <AdminLayoutContent>
//               {children}
//             </AdminLayoutContent>
//             <Toaster />
//           </AdminProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }




"use client"

import { Inter } from 'next/font/google'
import { AdminProvider } from '@/components/admin/admin-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { useAdmin } from '@/components/admin/admin-provider'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAdmin()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if current page is login (don't show sidebar on login)
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      // Redirect to login if not authenticated and not already on login page
      window.location.href = '/admin/login'
    }
  }, [user, isLoading, isLoginPage])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Don't render sidebar on login page
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full">
        {children}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <AdminSidebar 
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:ml-64 overflow-hidden">
        {/* Content wrapper with proper padding */}
        <main className="min-h-screen w-full">
          {/* Mobile top padding to account for menu button */}
          <div className="pt-16 lg:pt-0 w-full">
            <div className="w-full max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            <AdminLayoutContent>
              {children}
            </AdminLayoutContent>
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}