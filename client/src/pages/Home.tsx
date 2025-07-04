import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MapPin, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ["/api/profiles/me"],
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/ratings/stats"],
  });

  const { data: recentUsers } = useQuery({
    queryKey: ["/api/users", { limit: 4 }],
  });

  const hasProfile = !!profile;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Fighter'}!
        </h1>
        <p className="text-muted-foreground">
          Connect with the Jiu-Jitsu community in your area
        </p>
      </div>

      {/* Profile Setup Alert */}
      {!hasProfile && (
        <Card className="mb-8 border-accent">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Plus className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Add your training information to connect with other martial artists
                </p>
              </div>
              <Link href="/profile-edit">
                <Button className="bg-accent hover:bg-accent/90">
                  Create Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="stats-number">{stats?.averageRating.toFixed(1) || "0.0"}</div>
            <div className="text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="stats-number">{stats?.totalReviews || 0}</div>
            <div className="text-muted-foreground">Total Reviews</div>
          </CardContent>
        </Card>
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="stats-number">{stats?.activeMembers || 0}</div>
            <div className="text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Find Training Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discover martial artists in your area and skill level
            </p>
            <Link href="/explore">
              <Button className="w-full">
                Explore Community
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Rated Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              See who's making an impact in the community
            </p>
            <Link href="/ratings">
              <Button variant="outline" className="w-full">
                View Rankings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Community Members */}
      {recentUsers && recentUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Community Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentUsers.slice(0, 4).map((member: any) => (
                <div key={member.id} className="text-center">
                  <div className="mb-3">
                    <img 
                      src={member.profileImageUrl || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}`}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="profile-avatar mx-auto"
                    />
                  </div>
                  <h4 className="font-semibold text-sm">
                    {member.firstName} {member.lastName}
                  </h4>
                  {member.profile && (
                    <div className="flex justify-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {member.profile.role}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {member.profile?.location || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
