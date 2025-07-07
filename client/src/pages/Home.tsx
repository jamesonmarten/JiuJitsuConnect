import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Star, User, UserPlus, Search, Trophy, Plus, TestTube, Upload } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showTestSection, setShowTestSection] = useState(false);
  const [testUserForm, setTestUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    skillLevel: "",
    gymAffiliation: "",
    location: "",
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>({
    queryKey: ["/api/ratings/stats"],
  });

  const seedMembersMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/seed-members", "POST", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "MMA members seeded successfully! Check the Explore page.",
      });
    },
  });

  const createTestUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/create-test-user", "POST", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setTestUserForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        skillLevel: "",
        gymAffiliation: "",
        location: "",
      });
      toast({
        title: "Test User Created",
        description: `${data.user.firstName} ${data.user.lastName} has been added to the platform!`,
      });
    },
  });

  const handleCreateTestUser = () => {
    if (!testUserForm.firstName || !testUserForm.lastName) {
      toast({
        title: "Missing Information",
        description: "Please provide at least first name and last name.",
        variant: "destructive",
      });
      return;
    }
    createTestUserMutation.mutate(testUserForm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">🥋</span>
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-600">MMA Connect</h2>
              <p className="text-sm text-muted-foreground">by Dev Cabin Technologies</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.firstName || 'Fighter'}! 🥋
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with the elite MMA community in Central Florida & Southeastern Wisconsin
          </p>
        </div>
      </div>

      {/* Profile Setup Banner */}
      {!user?.profile && (
        <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-orange-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                  Complete Your Profile
                </h3>
                <p className="text-orange-700 dark:text-orange-200">
                  Set up your martial arts profile to connect with training partners and instructors.
                </p>
              </div>
              <Link href="/profile-edit">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Setup Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : (stats?.averageRating?.toFixed(1) || "0.0")}
            </div>
            <p className="text-xs text-muted-foreground">
              Community rating average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : (stats?.totalReviews || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Training session reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : (stats?.activeMembers || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Community members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Find Training Partners</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Discover martial artists in your area
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Explore Community
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Manage Profile</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update your information and training journal
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/my-profile">
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                View Profile
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
              No recent activity to show. Start by exploring the community or updating your profile!
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/explore">
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Explore Community
                </Button>
              </Link>
              <Link href="/recommendations">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <span className="mr-2">🧠</span>
                  AI Match
                </Button>
              </Link>
              <Link href="/gym-finder">
                <Button variant="outline">
                  <Trophy className="h-4 w-4 mr-2" />
                  Find Gyms
                </Button>
              </Link>
              <Link href="/profile-edit">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </Link>
            </div>
            
            {/* Easter Egg */}
            <div className="mt-6 text-xs text-muted-foreground space-y-2">
              <p className="cursor-pointer hover:text-primary transition-colors" 
                 onClick={() => {
                   console.log("🥋 You found the secret dojo! The path of the warrior is patience...");
                   alert("🥋 Secret dojo discovered! +10 XP to your martial arts journey!");
                 }}>
                💡 Tip: Click here for a surprise
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Section for Development */}
      <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TestTube className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-900 dark:text-yellow-100">
                Development Testing Tools
              </CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTestSection(!showTestSection)}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900"
            >
              {showTestSection ? 'Hide' : 'Show'} Test Tools
            </Button>
          </div>
          <p className="text-yellow-700 dark:text-yellow-200 text-sm">
            Test all functionality before deployment - Create new users, upload content, and validate features
          </p>
        </CardHeader>
        
        {showTestSection && (
          <CardContent className="space-y-6">
            {/* Quick Test Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => seedMembersMutation.mutate()}
                disabled={seedMembersMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                {seedMembersMutation.isPending ? "Seeding..." : "Add MMA Fighters"}
              </Button>
              
              <Link href="/my-profile">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Test Media Upload
                </Button>
              </Link>
              
              <Link href="/explore">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  View All Users
                </Button>
              </Link>

              <Link href="/guide">
                <Button variant="outline" className="w-full bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-700">
                  <TestTube className="h-4 w-4 mr-2" />
                  Elite Guide
                </Button>
              </Link>
            </div>

            {/* Create Test User Form */}
            <div className="border border-yellow-300 rounded-lg p-4 bg-white dark:bg-yellow-900/20">
              <h4 className="font-semibold mb-4 text-yellow-900 dark:text-yellow-100">
                Create New Test User
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={testUserForm.firstName}
                    onChange={(e) => setTestUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={testUserForm.lastName}
                    onChange={(e) => setTestUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={testUserForm.email}
                    onChange={(e) => setTestUserForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={testUserForm.role} onValueChange={(value) => 
                    setTestUserForm(prev => ({ ...prev, role: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select value={testUserForm.skillLevel} onValueChange={(value) => 
                    setTestUserForm(prev => ({ ...prev, skillLevel: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gymAffiliation">Gym Affiliation</Label>
                  <Input
                    id="gymAffiliation"
                    placeholder="Orlando BJJ Academy"
                    value={testUserForm.gymAffiliation}
                    onChange={(e) => setTestUserForm(prev => ({ ...prev, gymAffiliation: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={handleCreateTestUser}
                  disabled={createTestUserMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createTestUserMutation.isPending ? "Creating..." : "Create Test User"}
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}