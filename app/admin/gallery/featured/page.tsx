"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Star, ArrowLeft, Edit, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function FeaturedGalleryPage() {
  const router = useRouter()
  const { admin } = useAdmin()
  const { toast } = useToast()
  const [featuredImages, setFeaturedImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFeaturedImages = async () => {
    setLoading(true)
    try {
      admin.gallery.imageList({
        params: { featured: true },
        onSuccess: (data) => {
          setFeaturedImages(data.data || [])
          setLoading(false)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to fetch featured images",
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
    fetchFeaturedImages()
  }, [])

  const handleRemoveFromFeatured = async (imageId: number) => {
    try {
      admin.gallery.updateImage({
        formData: {
          image_id: imageId,
          featured: false
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Image removed from featured",
          })
          fetchFeaturedImages()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update image",
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

  const handleDeleteImage = async (imageId: number) => {
    try {
      admin.gallery.deleteImage({
        formData: { image_id: imageId },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Image deleted successfully",
          })
          fetchFeaturedImages()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete image",
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

  const ImageCard = ({ image }: { image: any }) => (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-gray-100">
        <img 
          src={image.image || "/placeholder.svg"} 
          alt={image.description || 'Featured image'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => window.open(image.image, '_blank')}>
                <Eye className="mr-2 h-4 w-4" />
                View Full Size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRemoveFromFeatured(image.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Remove from Featured
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Image
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the image
                      from the gallery.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteImage(image.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardDescription className="text-sm">
          {image.description || 'No description'}
        </CardDescription>
      </CardHeader>
    </Card>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <AdminHeader 
          title="Featured Images" 
          description="Manage images featured on the homepage"
        />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Gallery ({featuredImages.length})
              </CardTitle>
              <CardDescription>
                Images that are prominently displayed on the homepage
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/admin/gallery')} variant="outline">
              Manage All Images
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <CardHeader className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredImages.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}

          {featuredImages.length === 0 && !loading && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No featured images</h3>
              <p className="text-muted-foreground mb-4">
                No images are currently featured on the homepage.
              </p>
              <Button onClick={() => router.push('/admin/gallery')}>
                <Star className="mr-2 h-4 w-4" />
                Feature Some Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Featured Images</CardTitle>
          <CardDescription>
            How featured images work on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Homepage Display</h4>
              <p className="text-sm text-muted-foreground">
                Featured images are prominently displayed on the homepage gallery section. 
                They help showcase the best aspects of your accommodation.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Automatic Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Featured images are automatically optimized for web display to ensure 
                fast loading times while maintaining quality.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Practices</h4>
              <p className="text-sm text-muted-foreground">
                Use high-quality images that represent your accommodation well. 
                Aim for 4-8 featured images for the best visual impact.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Management</h4>
              <p className="text-sm text-muted-foreground">
                You can easily add or remove images from featured status. 
                Changes are reflected on the website immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
