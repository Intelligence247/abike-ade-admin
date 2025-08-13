"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Save, User, Mail, Calendar, Shield, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    date_joined: '',
    last_login: '',
    is_active: false,
    is_staff: false,
    is_superuser: false
  })

  const [editableProfile, setEditableProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })

  const fetchProfile = async () => {
    setLoading(true)
    try {
      admin.account.profile({
        onSuccess: (data) => {
          setProfile(data.data)
          setEditableProfile({
            first_name: data.data.first_name || '',
            last_name: data.data.last_name || '',
            email: data.data.email || ''
          })
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch profile information",
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
    fetchProfile()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditableProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      admin.account.updateProfile({
        formData: editableProfile,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Profile updated successfully",
          })
          setProfile(prev => ({
            ...prev,
            ...editableProfile
          }))
          setSaving(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update profile",
            variant: "destructive",
          })
          setSaving(false)
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Profile" 
        description="Manage your admin account information"
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
                {profile.first_name?.[0] || 'A'}{profile.last_name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {profile.first_name} {profile.last_name} || 'Admin User'}
                </h3>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Joined {profile.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Last login: {profile.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {profile.is_active && (
                  <Badge variant="default">Active</Badge>
                )}
                {profile.is_staff && (
                  <Badge variant="secondary">Staff</Badge>
                )}
                {profile.is_superuser && (
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Super Admin
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={editableProfile.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={editableProfile.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editableProfile.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {saving ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last changed: Never (or date if available)
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/settings">Change Password</a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/settings">Configure 2FA</a>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Login History</h4>
              <p className="text-sm text-muted-foreground">
                Monitor recent login activity on your account
              </p>
              <Button variant="outline" size="sm" disabled>
                View History (Coming Soon)
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Account Status</h4>
              <p className="text-sm text-muted-foreground">
                Your account is active and in good standing
              </p>
              <Badge variant="default">Active Account</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
