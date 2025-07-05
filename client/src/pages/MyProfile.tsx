import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, BookOpen, Camera, Settings, Award } from "lucide-react";
import { Link } from "wouter";

export default function MyProfile() {
  const { user } = useAuth();

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
            <Button className="w-full" size="sm">
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
            <Button variant="outline" className="w-full" size="sm">
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
    </div>
  );
}