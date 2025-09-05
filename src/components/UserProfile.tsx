import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Edit3, LogOut, Shield, Bell } from "lucide-react";
import { useState } from "react";

interface UserProfileProps {
  user: { name: string; email: string };
  onBack: () => void;
  onUpdateProfile: (userData: { name: string; email: string; username: string }) => void;
  onSignOut: () => void;
}

export const UserProfile = ({ user, onBack, onUpdateProfile, onSignOut }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    username: "@johndoe",
    phone: "+1 (555) 123-4567"
  });

  const handleSave = () => {
    onUpdateProfile({
      name: formData.name,
      email: formData.email,
      username: formData.username
    });
    setIsEditing(false);
  };

  const menuItems = [
    { icon: Shield, label: "Security", description: "Password, 2FA, Login history" },
    { icon: Bell, label: "Notifications", description: "Push notifications, Email alerts" },
    { icon: LogOut, label: "Sign Out", description: "Sign out of your account", action: onSignOut, danger: true },
  ];

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

      <div className="flex-1 p-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 shadow-elevated">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
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
                <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
                <p className="text-muted-foreground">{formData.username}</p>
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
                    value={formData.name.split(' ')[0]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: `${e.target.value} ${prev.name.split(' ')[1] || ''}`
                    }))}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.name.split(' ')[1] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: `${prev.name.split(' ')[0]} ${e.target.value}`
                    }))}
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                <span className="font-medium">{formData.phone}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">December 2024</span>
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.danger ? 'bg-destructive/10' : 'bg-primary/10'
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      item.danger ? 'text-destructive' : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* App Version */}
        {!isEditing && (
          <div className="text-center pt-6">
            <p className="text-sm text-muted-foreground">PayFlow v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};