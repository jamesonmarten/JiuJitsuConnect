import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, User, UserPlus, Search, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>({
    queryKey: ["/api/ratings/stats"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || 'Fighter'}! 🥋
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect with the Jiu-Jitsu community in Longwood & Orlando
        </p>
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
              
              {/* Temporary seeding button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/seed-members', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                    });
                    
                    if (response.ok) {
                      alert('🥋 Famous MMA fighters added to the community!');
                      window.location.reload();
                    } else {
                      console.error('Failed to seed members');
                    }
                  } catch (error) {
                    console.error('Error seeding members:', error);
                  }
                }}
              >
                🥋 Add Famous Fighters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}