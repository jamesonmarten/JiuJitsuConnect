import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, ArrowLeft, Loader } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserWithProfile, InsertProfile } from "@shared/schema";

export default function ProfileEdit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch user profile data
  const { data: userWithProfile, isLoading } = useQuery<UserWithProfile>({
    queryKey: [`/api/users/${user?.id}`],
    enabled: !!user?.id,
  });

  const [formData, setFormData] = useState({
    role: "",
    skillLevel: "",
    gymAffiliation: "",
    location: "",
    beltRank: "white",
    bio: "",
    trainingGoals: "",
    availability: "",
  });

  // Update form data when profile loads
  useEffect(() => {
    if (userWithProfile?.profile) {
      setFormData({
        role: userWithProfile.profile.role || "",
        skillLevel: userWithProfile.profile.skillLevel || "",
        gymAffiliation: userWithProfile.profile.gymAffiliation || "",
        location: userWithProfile.profile.location || "",
        beltRank: userWithProfile.profile.beltRank || "white",
        bio: userWithProfile.profile.bio || "",
        trainingGoals: userWithProfile.profile.trainingGoals || "",
        availability: userWithProfile.profile.availability || "",
      });
    }
  }, [userWithProfile]);

  const mutation = useMutation({
    mutationFn: async (profileData: any) => {
      if (userWithProfile?.profile) {
        // Update existing profile
        return await apiRequest("/api/profiles", "PUT", {
          ...profileData,
          userId: user?.id
        });
      } else {
        // Create new profile
        return await apiRequest("/api/profiles", "POST", {
          ...profileData,
          userId: user?.id
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/my-profile");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.role) {
      toast({
        title: "Validation Error",
        description: "Please select your role",
        variant: "destructive",
      });
      return;
    }

    if (!formData.skillLevel) {
      toast({
        title: "Validation Error",
        description: "Please select your skill level",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setLocation("/my-profile");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading profile...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/my-profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Update your martial arts profile information
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skill Level */}
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level <span className="text-red-500">*</span></Label>
                <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange("skillLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Belt Rank */}
              <div className="space-y-2">
                <Label htmlFor="beltRank">Belt Rank</Label>
                <Select value={formData.beltRank} onValueChange={(value) => handleInputChange("beltRank", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your belt rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="coral">Coral</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gym Affiliation */}
              <div className="space-y-2">
                <Label htmlFor="gymAffiliation">Gym/Academy Affiliation</Label>
                <Input
                  id="gymAffiliation"
                  value={formData.gymAffiliation}
                  onChange={(e) => handleInputChange("gymAffiliation", e.target.value)}
                  placeholder="Enter your gym or academy"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, State or Area"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your martial arts journey..."
                  rows={4}
                />
              </div>

              {/* Training Goals */}
              <div className="space-y-2">
                <Label htmlFor="trainingGoals">Training Goals</Label>
                <Textarea
                  id="trainingGoals"
                  value={formData.trainingGoals}
                  onChange={(e) => handleInputChange("trainingGoals", e.target.value)}
                  placeholder="What are your training goals and objectives?"
                  rows={3}
                />
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  placeholder="When are you typically available for training?"
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}