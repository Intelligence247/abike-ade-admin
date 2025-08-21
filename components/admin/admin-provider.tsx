"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'super_admin' | 'moderator'
  permissions: string[]
  avatar?: string
  last_login?: string
  is_active: boolean
}

interface AdminContextType {
  admin: any
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  userPermissions: string[]
  hasPermission: (permission: string) => boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  checkAuth: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Define available permissions
export const ADMIN_PERMISSIONS = {
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Property Management
  ROOMS_VIEW: 'rooms:view',
  ROOMS_CREATE: 'rooms:create',
  ROOMS_EDIT: 'rooms:edit',
  ROOMS_DELETE: 'rooms:delete',
  
  // Financial
  TRANSACTIONS_VIEW: 'transactions:view',
  TRANSACTIONS_REFUND: 'transactions:refund',
  TRANSACTIONS_REPORTS: 'transactions:reports',
  
  // Content
  GALLERY_VIEW: 'gallery:view',
  GALLERY_UPLOAD: 'gallery:upload',
  GALLERY_DELETE: 'gallery:delete',
  
  // Communication
  MESSAGES_VIEW: 'messages:view',
  MESSAGES_SEND: 'messages:send',
  BROADCASTS_SEND: 'broadcasts:send',
  
  // System
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  SYSTEM_ADMIN: 'system:admin'
} as const

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission) || user.role === 'super_admin'
  }

  // Get user permissions
  const userPermissions = user?.permissions || []

  // Check if user is authenticated
  const isAuthenticated = !!user

  useEffect(() => {
    // Only initialize admin SDK on the client side
    if (typeof window !== 'undefined') {
      import('abikeade-sdk').then(({ Admin }) => {
        const adminSDK = new Admin()
        console.log('Admin SDK initialized:', adminSDK)
        setAdmin(adminSDK)
        
        // Check if user is authenticated
        checkAuth(adminSDK)
      }).catch((error) => {
        console.error('Failed to load admin SDK:', error)
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkAuth = async (adminSDK?: any) => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token && adminSDK) {
        // Check login status using the API
        adminSDK.account.loginStatus({
          onSuccess: (data: any) => {
            console.log('Auth check response:', data)
            if (data.authenticated) {
              // Get admin profile
              refreshUser(adminSDK)
            } else {
              localStorage.removeItem('admin_token')
              setUser(null)
              setIsLoading(false)
              router.push('/admin/login')
            }
          },
          onError: (error: any) => {
            console.error('Auth check failed:', error)
            localStorage.removeItem('admin_token')
            setUser(null)
            setIsLoading(false)
            router.push('/admin/login')
          }
        })
      } else {
        setIsLoading(false)
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoading(false)
      router.push('/admin/login')
    }
  }

  const refreshUser = async (adminSDK?: any) => {
    const sdk = adminSDK || admin
    if (!sdk) return

    try {
      sdk.account.getProfile({
        onSuccess: (profileData: any) => {
          console.log('Profile response:', profileData)
          if (profileData.status === 'success' && profileData.data) {
            // Enhance user data with default permissions based on role
            const userData = profileData.data
            const defaultPermissions = getDefaultPermissions(userData.role)
            
            const enhancedUser: User = {
              ...userData,
              permissions: userData.permissions || defaultPermissions,
              role: userData.role || 'admin',
              is_active: userData.is_active !== false
            }
            
            setUser(enhancedUser)
            setIsLoading(false)
          } else {
            throw new Error('Failed to fetch profile')
          }
        },
        onError: (error: any) => {
          console.error('Error fetching profile:', error)
          localStorage.removeItem('admin_token')
          setUser(null)
          setIsLoading(false)
          router.push('/admin/login')
        }
      })
    } catch (error) {
      console.error('Error refreshing user:', error)
      setIsLoading(false)
    }
  }

  // Get default permissions based on user role
  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'super_admin':
        return Object.values(ADMIN_PERMISSIONS)
      case 'admin':
        return [
          ADMIN_PERMISSIONS.USERS_VIEW,
          ADMIN_PERMISSIONS.USERS_EDIT,
          ADMIN_PERMISSIONS.ROOMS_VIEW,
          ADMIN_PERMISSIONS.ROOMS_EDIT,
          ADMIN_PERMISSIONS.TRANSACTIONS_VIEW,
          ADMIN_PERMISSIONS.TRANSACTIONS_REFUND,
          ADMIN_PERMISSIONS.GALLERY_VIEW,
          ADMIN_PERMISSIONS.GALLERY_UPLOAD,
          ADMIN_PERMISSIONS.MESSAGES_VIEW,
          ADMIN_PERMISSIONS.MESSAGES_SEND,
          ADMIN_PERMISSIONS.SETTINGS_VIEW
        ]
      case 'moderator':
        return [
          ADMIN_PERMISSIONS.USERS_VIEW,
          ADMIN_PERMISSIONS.ROOMS_VIEW,
          ADMIN_PERMISSIONS.TRANSACTIONS_VIEW,
          ADMIN_PERMISSIONS.GALLERY_VIEW,
          ADMIN_PERMISSIONS.MESSAGES_VIEW
        ]
      default:
        return []
    }
  }

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!admin) {
      return { success: false, message: 'Admin SDK not initialized' }
    }
    
    return new Promise((resolve) => {
      console.log('Attempting login with:', { username, password })
      
      admin.account.login({
        formData: { username, password },
        onSuccess: (data: any) => {
          console.log('Login response:', data)
          
          // Check if login was successful according to API response structure
          if (data.status === 'success' && data.message === 'Login successful') {
            // Store a session token for local state management
            const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem('admin_token', sessionToken)
            
            // Try to set token if the method exists (optional)
            if (typeof admin.setToken === 'function') {
              try {
                admin.setToken(sessionToken)
                console.log('Token set successfully')
              } catch (error) {
                console.warn('setToken method failed, continuing without it:', error)
              }
            } else {
              console.log('setToken method not available, continuing without it')
            }
            
            // Get user profile
            refreshUser(admin).then(() => {
              resolve({ success: true, message: 'Login successful' })
            }).catch(() => {
              resolve({ success: false, message: 'Failed to fetch profile' })
            })
          } else {
            resolve({ success: false, message: data.message || 'Login failed' })
          }
        },
        onError: (error: any) => {
          console.error('Login failed:', error)
          resolve({ success: false, message: error.message || 'Login failed' })
        }
      })
    })
  }

  const logout = () => {
    if (admin) {
      admin.account.logout({
        onSuccess: (data: any) => {
          console.log('Logout response:', data)
          localStorage.removeItem('admin_token')
          setUser(null)
          router.push('/admin/login')
        },
        onError: (error: any) => {
          console.error('Logout error:', error)
          localStorage.removeItem('admin_token')
          setUser(null)
          router.push('/admin/login')
        }
      })
    } else {
      localStorage.removeItem('admin_token')
      setUser(null)
      router.push('/admin/login')
    }
  }

  return (
    <AdminContext.Provider value={{ 
      admin, 
      user, 
      isLoading, 
      isAuthenticated,
      userPermissions,
      hasPermission,
      login, 
      logout, 
      checkAuth,
      refreshUser
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
