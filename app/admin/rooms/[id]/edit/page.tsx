"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Save, Upload, Image as ImageIcon, Images, X, Building } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

export default function EditRoomPage() {
  const params = useParams()
  const router = useRouter()
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    features: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [availableGalleryImages, setAvailableGalleryImages] = useState<any[]>([])
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false)
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<number[]>([])

  const roomId = params.id as string

  useEffect(() => {
    if (roomId && admin) {
      fetchRoomDetails()
      fetchGalleryImages()
      fetchAvailableGalleryImages()
    }
  }, [roomId, admin])

  const fetchRoomDetails = async () => {
    if (!admin) return
    try {
      admin.room.roomList({
        params: { room_id: parseInt(roomId) },
        onSuccess: (data) => {
          const room = data.data
          setFormData({
            title: room.title || '',
            price: room.price?.toString() || '',
            features: room.features || ''
          })
          setGalleryImages(room.images || [])
          setSelectedGalleryImages((room.images || []).map((img: any) => img.id))
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch room details",
            variant: "destructive",
          })
          setLoading(false)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    if (!admin) return
    try {
      admin.gallery.imageList({
        onSuccess: (data) => {
          setAvailableGalleryImages(data.data || [])
        },
        onError: (error) => {
          console.error('Failed to fetch gallery images:', error)
        }
      })
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    }
  }

  const fetchAvailableGalleryImages = async () => {
    if (!admin) return
    try {
      admin.gallery.imageList({
        onSuccess: (data) => {
          setAvailableGalleryImages(data.data || [])
        },
        onError: (error) => {
          console.error('Failed to fetch available gallery images:', error)
        }
      })
    } catch (error) {
      console.error('Error fetching available gallery images:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!admin) return
    setSaving(true)

    try {
      // Update room details
      admin.room.updateRoom({
        formData: {
          room_id: parseInt(roomId),
          title: formData.title,
          price: parseInt(formData.price) || 0,
          features: formData.features
        },
        onSuccess: async () => {
          // If there's a new image, upload it
          if (imageFile) {
            try {
              const formData = new FormData()
              formData.append('room_id', roomId)
              formData.append('image', imageFile)

              admin.room.updateRoomImage({
                formData,
                onSuccess: () => {
                  toast({
                    title: "Success",
                    description: "Room and image updated successfully",
                  })
                  router.push(`/admin/rooms/${roomId}`)
                },
                onError: (error) => {
                  toast({
                    title: "Warning",
                    description: "Room updated but image upload failed",
                    variant: "destructive",
                  })
                  router.push(`/admin/rooms/${roomId}`)
                }
              })
            } catch (imageError) {
              toast({
                title: "Warning",
                description: "Room updated but image upload failed",
                variant: "destructive",
              })
              router.push(`/admin/rooms/${roomId}`)
            }
          } else {
            toast({
              title: "Success",
              description: "Room updated successfully",
            })
            router.push(`/admin/rooms/${roomId}`)
          }
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update room",
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

  const handleGalleryUpdate = async () => {
    if (!admin) return
    try {
      admin.room.updateRoomGallery({
        formData: {
          room_id: parseInt(roomId),
          images: selectedGalleryImages
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Room gallery updated successfully",
          })
          setGalleryDialogOpen(false)
          fetchRoomDetails() // Refresh room details
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update room gallery",
            variant: "destructive",
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleGalleryImageToggle = (imageId: number) => {
    setSelectedGalleryImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId)
      } else {
        return [...prev, imageId]
      }
    })
  }

  if (loading || adminLoading || !admin) {
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
      <PageHeader
        title="Edit Room"
        description="Update room information and settings"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
              <CardDescription>
                Update the basic information for this room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Room Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Room 101, Deluxe Suite A"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 150000"
                  min="0"
                  step="100"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features & Description</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Describe the room features, amenities, and any special notes..."
                  rows={4}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Update Room Image</Label>
                <div className="space-y-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                    disabled={saving}
                  />
                  
                  {imageFile && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">{imageFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFile(null)}
                        disabled={saving}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Upload a new image to replace the current one (max 2MB, JPG, PNG, GIF)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !formData.title.trim() || !formData.price.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {saving ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Gallery</CardTitle>
                  <CardDescription>
                    Images currently associated with this room
                  </CardDescription>
                </div>
                <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Images className="mr-2 h-4 w-4" />
                      Manage Gallery
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Manage Room Gallery</DialogTitle>
                      <DialogDescription>
                        Select images from the gallery to associate with this room
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {availableGalleryImages.map((image) => (
                          <div key={image.id} className="relative">
                            <div className="relative">
                              <img
                                src={process.env.NEXT_PUBLIC_API_URL + "" + image.image || "/placeholder.svg"}
                                alt={image.description || 'Gallery image'}
                                className="w-full h-24 object-cover rounded-md border-2 cursor-pointer"
                                style={{
                                  borderColor: selectedGalleryImages.includes(image.id) 
                                    ? 'rgb(99 102 241)' 
                                    : 'rgb(229 231 235)'
                                }}
                                onClick={() => handleGalleryImageToggle(image.id)}
                              />
                              <Checkbox
                                checked={selectedGalleryImages.includes(image.id)}
                                onCheckedChange={() => handleGalleryImageToggle(image.id)}
                                className="absolute top-2 right-2"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {image.description || 'No description'}
                            </p>
                            {image.featured && (
                              <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setGalleryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleGalleryUpdate}>
                        <Images className="mr-2 h-4 w-4" />
                        Update Gallery
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL + "" + image.image || "/placeholder.svg"}
                        alt={image.description || 'Room image'}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      {image.featured && (
                        <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Images className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No images in gallery</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setGalleryDialogOpen(true)}
                  >
                    <Images className="mr-2 h-4 w-4" />
                    Add Images
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
