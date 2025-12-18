"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Users, Trophy, Upload, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createTeamSchema, type CreateTeamData } from "@/schemas/team.schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CreateTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTeamData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      isPrivate: false,
    },
  })

  const isPrivate = watch("isPrivate")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPG, PNG, and WebP formats are supported",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CreateTeamData) => {
    setLoading(true)

    try {
      // TODO: Implement team creation API call
      // For now, just simulate the creation
      console.log("Creating team with data:", data)

      // If image was selected, upload it first
      if (selectedImage) {
        // TODO: Upload image to Firebase Storage or your backend
        console.log("Uploading team logo:", selectedImage)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success!",
        description: "Team created successfully.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create team. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Team</h1>
            <p className="text-muted-foreground">Set up your team and start collaborating</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>Fill in the information below to create your team</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Team Logo */}
              <div className="space-y-2">
                <Label htmlFor="teamLogo">Team Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={previewUrl || undefined} alt="Team Logo" />
                    <AvatarFallback>
                      <Trophy className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      id="teamLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a team logo (JPG, PNG, WebP, max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Eagles Soccer Team"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Sport */}
              <div className="space-y-2">
                <Label htmlFor="sport">Sport *</Label>
                <Input
                  id="sport"
                  placeholder="e.g., Soccer, Basketball, Swimming"
                  {...register("sport")}
                />
                {errors.sport && (
                  <p className="text-sm text-destructive">{errors.sport.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your team..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Max Members */}
              <div className="space-y-2">
                <Label htmlFor="maxMembers" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Maximum Members
                </Label>
                <Input
                  id="maxMembers"
                  type="number"
                  placeholder="e.g., 30"
                  {...register("maxMembers", { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited members
                </p>
                {errors.maxMembers && (
                  <p className="text-sm text-destructive">{errors.maxMembers.message}</p>
                )}
              </div>

              {/* Private Team Toggle */}
              <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isPrivate" className="text-base">Private Team</Label>
                  <p className="text-sm text-muted-foreground">
                    Only invited members can join this team
                  </p>
                </div>
                <Switch
                  id="isPrivate"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setValue("isPrivate", checked)}
                />
              </div>

              {/* Invite Code (only show if private) */}
              {isPrivate && (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    placeholder="e.g., EAGLES2024"
                    {...register("inviteCode")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create a code for members to join your private team
                  </p>
                  {errors.inviteCode && (
                    <p className="text-sm text-destructive">{errors.inviteCode.message}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Create Team"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
