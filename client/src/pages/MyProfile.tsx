import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, BookOpen, Camera, Settings, Award, Plus, Upload } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function MyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [journalForm, setJournalForm] = useState({
    sessionType: "",
    duration: "",
    techniques: "",
    mood: "",
    notes: "",
  });
  const [mediaForm, setMediaForm] = useState({
    title: "",
    description: "",
    mediaType: "",
    techniques: "",
    isPublic: false,
  });

  const createJournalMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/journal-entries", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      setJournalModalOpen(false);
      setJournalForm({
        sessionType: "",
        duration: "",
        techniques: "",
        mood: "",
        notes: "",
      });
      toast({
        title: "Journal Entry Added",
        description: "Your training session has been logged successfully.",
      });
    },
  });

  const createMediaMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/training-media", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-media"] });
      setMediaModalOpen(false);
      setMediaForm({
        title: "",
        description: "",
        mediaType: "",
        techniques: "",
        isPublic: false,
      });
      toast({
        title: "Media Uploaded",
        description: "Your training media has been added successfully.",
      });
    },
  });

  const handleJournalSubmit = () => {
    if (!journalForm.sessionType || !journalForm.duration || !journalForm.mood) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createJournalMutation.mutate({
      sessionType: journalForm.sessionType,
      duration: parseInt(journalForm.duration),
      techniques: journalForm.techniques,
      mood: journalForm.mood,
      notes: journalForm.notes,
    });
  };

  const handleMediaSubmit = () => {
    if (!mediaForm.title || !mediaForm.mediaType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createMediaMutation.mutate({
      title: mediaForm.title,
      description: mediaForm.description,
      mediaType: mediaForm.mediaType,
      techniques: mediaForm.techniques,
      isPublic: mediaForm.isPublic,
      mediaUrl: "placeholder-url", // In real implementation, this would come from file upload
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your profile, training journal, and media gallery
        </p>
      </div>

      {/* Profile Setup Alert */}
      {!user.profile && (
        <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-orange-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                  Complete Your Profile
                </h3>
                <p className="text-orange-700 dark:text-orange-200">
                  Set up your martial arts profile to connect with the community.
                </p>
              </div>
              <Link href="/profile-edit">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Setup Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="text-lg">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Member since: {new Date(user.createdAt || '').toLocaleDateString()}</span>
                {user.profile && (
                  <>
                    <Badge variant="secondary">{user.profile.role}</Badge>
                    <Badge variant="outline">{user.profile.beltRank} belt</Badge>
                  </>
                )}
              </div>
            </div>
            <Link href="/profile-edit">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {user.profile && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Gym Affiliation</h4>
                <p className="text-muted-foreground">{user.profile.gymAffiliation || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <p className="text-muted-foreground">{user.profile.location || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Skill Level</h4>
                <p className="text-muted-foreground">{user.profile.skillLevel || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Training Goals</h4>
                <p className="text-muted-foreground">{user.profile.trainingGoals || 'Not specified'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Training Journal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Track your training sessions, mood, and progress
            </p>
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => setJournalModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Journal Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Camera className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Training Media</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload photos and videos from your sparring sessions
            </p>
            <Button 
              variant="outline" 
              className="w-full" 
              size="sm"
              onClick={() => setMediaModalOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Instructor Notes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View feedback and progress notes from instructors
            </p>
            <Link href="/instructor-notes">
              <Button variant="outline" className="w-full" size="sm">
                View Notes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Settings className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Profile Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Update your profile information and preferences
            </p>
            <Link href="/profile-edit">
              <Button variant="outline" className="w-full" size="sm">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              No recent activity to show. Start by completing your profile or adding a journal entry!
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/profile-edit">
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Find Training Partners
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entry Modal */}
      <Dialog open={journalModalOpen} onOpenChange={setJournalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Add Journal Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sessionType">Session Type <span className="text-red-500">*</span></Label>
              <Select value={journalForm.sessionType} onValueChange={(value) => 
                setJournalForm(prev => ({ ...prev, sessionType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drilling">Drilling</SelectItem>
                  <SelectItem value="rolling">Rolling</SelectItem>
                  <SelectItem value="sparring">Sparring</SelectItem>
                  <SelectItem value="technique">Technique Class</SelectItem>
                  <SelectItem value="conditioning">Conditioning</SelectItem>
                  <SelectItem value="open_mat">Open Mat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) <span className="text-red-500">*</span></Label>
              <Input
                id="duration"
                type="number"
                placeholder="90"
                value={journalForm.duration}
                onChange={(e) => setJournalForm(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="mood">Mood <span className="text-red-500">*</span></Label>
              <Select value={journalForm.mood} onValueChange={(value) => 
                setJournalForm(prev => ({ ...prev, mood: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="How did you feel?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">😄 Excellent</SelectItem>
                  <SelectItem value="good">😊 Good</SelectItem>
                  <SelectItem value="neutral">😐 Neutral</SelectItem>
                  <SelectItem value="challenging">😅 Challenging</SelectItem>
                  <SelectItem value="frustrated">😤 Frustrated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="techniques">Techniques Practiced</Label>
              <Input
                id="techniques"
                placeholder="Guard passes, submissions, etc."
                value={journalForm.techniques}
                onChange={(e) => setJournalForm(prev => ({ ...prev, techniques: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Thoughts, lessons learned, goals for next session..."
                value={journalForm.notes}
                onChange={(e) => setJournalForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setJournalModalOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleJournalSubmit} 
                disabled={createJournalMutation.isPending}
                className="flex-1"
              >
                {createJournalMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Upload Modal */}
      <Dialog open={mediaModalOpen} onOpenChange={setMediaModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Training Media
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Sparring session highlights"
                value={mediaForm.title}
                onChange={(e) => setMediaForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="mediaType">Media Type <span className="text-red-500">*</span></Label>
              <Select value={mediaForm.mediaType} onValueChange={(value) => 
                setMediaForm(prev => ({ ...prev, mediaType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="techniques">Techniques Featured</Label>
              <Input
                id="techniques"
                placeholder="Guard pass, armbar, etc."
                value={mediaForm.techniques}
                onChange={(e) => setMediaForm(prev => ({ ...prev, techniques: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what's happening in this media..."
                value={mediaForm.description}
                onChange={(e) => setMediaForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={mediaForm.isPublic}
                onChange={(e) => setMediaForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isPublic">Make this media public</Label>
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded">
              📝 Note: File upload functionality would be implemented here in a real application.
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setMediaModalOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMediaSubmit} 
                disabled={createMediaMutation.isPending}
                className="flex-1"
              >
                {createMediaMutation.isPending ? "Uploading..." : "Upload Media"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}