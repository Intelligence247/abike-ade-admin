"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminContextType {
  admin: any
  user: any
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
              adminSDK.account.getProfile({
                onSuccess: (profileData: any) => {
                  console.log('Profile response:', profileData)
                  if (profileData.status === 'success' && profileData.data) {
                    setUser(profileData.data)
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
            admin.account.getProfile({
              onSuccess: (profileData: any) => {
                console.log('Profile fetch response:', profileData)
                if (profileData.status === 'success' && profileData.data) {
                  setUser(profileData.data)
                  resolve({ success: true, message: 'Login successful' })
                } else {
                  resolve({ success: false, message: 'Failed to fetch profile' })
                }
              },
              onError: (error: any) => {
                console.error('Error fetching profile:', error)
                resolve({ success: false, message: 'Failed to fetch profile' })
              }
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
    <AdminContext.Provider value={{ admin, user, isLoading, login, logout, checkAuth }}>
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
