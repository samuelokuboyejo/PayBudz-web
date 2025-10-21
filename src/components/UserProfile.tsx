/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Camera, Edit3, LogOut, Shield, Bell } from "lucide-react"
import { userApi } from "@/lib/api"
import { toast } from "sonner"

interface UserProfileProps {
  onBack: () => void
  onSignOut: () => void
}

export const UserProfile = ({ onBack, onSignOut }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
  })
  const [usernameStatus, setUsernameStatus] = useState<"available" | "taken" | "checking" | null>(null)
  const [usernameMessage, setUsernameMessage] = useState("")


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userApi.getProfile()
        setUser(profile)
        setFormData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          username: profile.username,
          phone: profile.phone || "",
        })
      } catch (err) {
        console.error(err)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    try {
      if (!user?.id) return toast.error("User ID not found")

      await userApi.updateUsername(user.id, formData.username)
      toast.success("Profile updated successfully")

      setUser((prev: any) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
      }))
      setIsEditing(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Failed to update profile")
    }
  }

  const menuItems = [
    {
      icon: Shield,
      label: "Security",
      description: "Password, 2FA, Login history",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Push notifications, Email alerts",
    },
    {
      icon: LogOut,
      label: "Sign Out",
      description: "Sign out of your account",
      action: onSignOut,
      danger: true,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">
        Could not load profile data.
      </div>
    )
  }

  const fullName = `${formData.firstName} ${formData.lastName}`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-xl font-semibold">Profile</h1>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Edit3 className="h-5 w-5" />
        </Button>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-elevated">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            {!isEditing && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {fullName}
                </h2>
                <p className="text-muted-foreground">@{formData.username}</p>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={async (e) => {
                    const newUsername = e.target.value
                    setFormData((prev) => ({ ...prev, username: newUsername }))

                    if (!newUsername.trim()) {
                      setUsernameStatus(null)
                      setUsernameMessage("")
                      return
                    }

                    setUsernameStatus("checking")
                    setUsernameMessage("Checking availability...")

                    try {
                      const result = await userApi.checkUsernameAvailability(newUsername)
                      if (result.available) {
                        setUsernameStatus("available")
                        setUsernameMessage("Username is available ")
                      } else {
                        setUsernameStatus("taken")
                        setUsernameMessage("Username is already taken ")
                      }
                    } catch (err) {
                      console.error(err)
                      setUsernameStatus(null)
                      setUsernameMessage("Could not check availability")
                    }
                  }}
                  className="h-12"
                />

                {usernameMessage && (
                  <p
                    className={`text-sm mt-1 ${usernameStatus === "available"
                        ? "text-green-600"
                        : usernameStatus === "taken"
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                  >
                    {usernameMessage}
                  </p>
                )}
              </div>


              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="h-12"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">
                  {formData.phone || "Not set"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Menu Items */}
        {!isEditing && (
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-elevated transition-all duration-300"
                onClick={item.action}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${item.danger ? "bg-destructive/10" : "bg-primary/10"
                      }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.danger ? "text-destructive" : "text-primary"
                        }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${item.danger ? "text-destructive" : "text-foreground"
                        }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* App Footer */}
        {!isEditing && (
          <div className="text-center pt-6">
            <p className="text-sm text-muted-foreground">PayBudz</p>
          </div>
        )}
      </div>
    </div>
  )
}
