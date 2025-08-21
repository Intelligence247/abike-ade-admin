"use client"

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdmin } from '@/components/admin/admin-provider'
import { useToast } from '@/components/ui/use-toast'
import { Search, Upload, Star, Edit, Trash2, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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

export default function GalleryPage() {
  const { admin, isLoading: adminLoading } = useAdmin()
  const { toast } = useToast()
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [uploadForm, setUploadForm] = useState({
    description: '',
    featured: false
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const fetchImages = async (page = 1, search = '') => {
    setLoading(true)
    try {
      admin.gallery.imageList({
        params: {
          page,
          per_page: 20,
          search
        },
        onSuccess: (data: any) => {
          setImages(data.data || [])
          setCurrentPage(data.page_number || 1)
          setTotalPages(data.total_pages || 1)
          setTotalItems(data.total_items || 0)
          setLoading(false)
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: "Failed to fetch images",
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
    // Wait for admin SDK to be ready before fetching data
    if (!adminLoading && admin) {
      fetchImages()
    }
  }, [adminLoading, admin])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchImages(1, searchTerm)
  }

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('description', uploadForm.description)
      formData.append('featured', uploadForm.featured.toString())

      admin.gallery.addImage({
        formData,
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          })
          setUploadDialogOpen(false)
          setUploadForm({ description: '', featured: false })
          setImageFile(null)
          fetchImages()
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to upload image",
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

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return

    try {
      admin.gallery.updateImage({
        formData: {
          image_id: selectedImage.id,
          description: uploadForm.description,
          featured: uploadForm.featured
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Image updated successfully",
          })
          setEditDialogOpen(false)
          setSelectedImage(null)
          setUploadForm({ description: '', featured: false })
          fetchImages()
        },
        onError: (error: any) => {
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
          fetchImages()
        },
        onError: (error: any) => {
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

  const openEditDialog = (image: any) => {
    setSelectedImage(image)
    setUploadForm({
      description: image.description || '',
      featured: image.featured || false
    })
    setEditDialogOpen(true)
  }

  const ImageCard = ({ image }: { image: any }) => (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-gray-100">
        <img 
          src={process.env.NEXT_PUBLIC_API_URL + "" + image.image || "/placeholder.svg"} 
          alt={image.description || 'Gallery image'}
          className="w-full h-full object-cover"
        />
        {image.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => window.open(process.env.NEXT_PUBLIC_API_URL + "" + image.image, '_blank')}>
                <Eye className="mr-2 h-4 w-4" />
                View Full Size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditDialog(image)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
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

  // Show loading state while admin is initializing
  if (adminLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminHeader 
        title="Gallery Management" 
        description="Manage site images and featured content"
      />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Image Gallery ({totalItems})</CardTitle>
              <CardDescription>
                Upload and manage images for the website gallery
              </CardDescription>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload New Image</DialogTitle>
                  <DialogDescription>
                    Add a new image to the gallery
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUploadImage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image File</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 2MB
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the image..."
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                    <Checkbox
                      id="featured"
                      checked={uploadForm.featured}
                      onCheckedChange={(checked) => setUploadForm(prev => ({ ...prev, featured: !!checked }))}
                    />
                    <Label htmlFor="featured">Feature on homepage</Label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!imageFile}>
                      Upload Image
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images by description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" className="flex-1 sm:flex-none">Search</Button>
          </form>
          
          {loading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}

          {images.length === 0 && !loading && (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No images match your search criteria.' : 'Get started by uploading your first image.'}
              </p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-6">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchImages(currentPage - 1, searchTerm)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchImages(currentPage + 1, searchTerm)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
            <DialogDescription>
              Update the image description and featured status
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateImage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the image..."
                rows={3}
              />
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <Checkbox
                id="edit-featured"
                checked={uploadForm.featured}
                onCheckedChange={(checked) => setUploadForm(prev => ({ ...prev, featured: !!checked }))}
              />
              <Label htmlFor="edit-featured">Feature on homepage</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Image
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
