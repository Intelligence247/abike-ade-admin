"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'

export default function SiteManagementPage() {
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteInfo, setSiteInfo] = useState({
    title: '',
    email: '',
    phone_number: '',
    address: '',
    facebook: '',
    whatsapp: '',
    instagram: '',
    logo: ''
  })

  const fetchSiteInfo = async () => {
    setLoading(true)
    try {
      admin.site.siteInfo({
        onSuccess: (data) => {
          setSiteInfo(data.data)
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch site information",
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
    fetchSiteInfo()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSiteInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      admin.site.updateSite({
        formData: {
          email: siteInfo.email,
          phone_number: siteInfo.phone_number,
          address: siteInfo.address,
          facebook: siteInfo.facebook,
          whatsapp: siteInfo.whatsapp,
          instagram: siteInfo.instagram
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Site information updated successfully",
          })
          setSaving(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update site information",
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
        title="Site Management" 
        description="Update site information and contact details"
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                General site information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Site Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={siteInfo.title}
                  onChange={handleInputChange}
                  placeholder="Site title"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Site title cannot be changed from admin panel
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={siteInfo.email}
                    onChange={handleInputChange}
                    placeholder="contact@abikeadecourt.com"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={siteInfo.phone_number}
                    onChange={handleInputChange}
                    placeholder="+234 xxx xxx xxxx"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    value={siteInfo.address}
                    onChange={handleInputChange}
                    placeholder="Physical address"
                    className="pl-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Social media profiles and contact links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Page</Label>
                <div className="relative">
                  <Facebook className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebook"
                    name="facebook"
                    value={siteInfo.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/abikeadecourt"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Profile</Label>
                <div className="relative">
                  <Instagram className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    name="instagram"
                    value={siteInfo.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/abikeadecourt"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Link</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={siteInfo.whatsapp}
                    onChange={handleInputChange}
                    placeholder="https://wa.me/234xxxxxxxxxx"
                    className="pl-8"
                  />
                </div>
              </div>

              {siteInfo.logo && (
                <div className="space-y-2">
                  <Label>Current Logo</Label>
                  <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <img 
                      src={siteInfo.logo || "/placeholder.svg"} 
                      alt="Site logo" 
                      className="h-12 w-12 object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium">Logo uploaded</p>
                      <p className="text-xs text-muted-foreground">
                        Logo changes require developer assistance
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Important notes about site management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Contact Information</h4>
              <p className="text-sm text-muted-foreground">
                The contact information you provide here will be displayed on the 
                public website. Make sure all details are accurate and up-to-date.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Social Media</h4>
              <p className="text-sm text-muted-foreground">
                Social media links help visitors connect with you on different platforms. 
                Use full URLs including https:// for proper linking.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Logo Updates</h4>
              <p className="text-sm text-muted-foreground">
                Logo changes require technical assistance. Contact your developer 
                if you need to update the site logo or branding elements.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Changes Effect</h4>
              <p className="text-sm text-muted-foreground">
                Changes made here will be reflected on the public website immediately 
                after saving. Review all information before submitting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
