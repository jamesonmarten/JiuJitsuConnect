import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, MapPin, Plus, User } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profiles/me"],
    enabled: !!user,
  });

  const { data: stats } = useQuery<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>({
    queryKey: ["/api/ratings/stats"],
  });

  const { data: recentUsers } = useQuery<any[]>({
    queryKey: ["/api/users", { limit: 4 }],
  });

  const hasProfile = !!profile;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="welcome-title mb-4 floating">
          Welcome back, Fighter! 🥋
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect with the Jiu-Jitsu community in Longwood & Orlando
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
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Complete Profile
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
            <div className="stats-number">{stats?.averageRating?.toFixed(1) || "0.0"}</div>
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
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="action-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Find Training Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with other martial artists in your area
            </p>
            <Link href="/explore">
              <Button variant="secondary" className="w-full bg-secondary hover:bg-secondary/90 text-white">
                Explore Community 🔍
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="action-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Rate & Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Share your training experiences with others
            </p>
            <Link href="/ratings">
              <Button variant="secondary" className="w-full bg-secondary hover:bg-secondary/90 text-white">
                View Ratings ⭐
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="action-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your profile and training journal
            </p>
            <Link href="/my-profile">
              <Button variant="secondary" className="w-full bg-secondary hover:bg-secondary/90 text-white">
                View Profile 👤
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Community Members */}
      {recentUsers && Array.isArray(recentUsers) && recentUsers.length > 0 && (
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
                      src={member.profileImageUrl || "/api/placeholder/64/64"}
                      alt={member.firstName || "Member"}
                      className="w-16 h-16 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-sm">
                    {member.firstName || "Member"} {member.lastName || ""}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {member.profile?.role || "Member"}
                  </p>
                  <Link href={`/profile/${member.id}`}>
                    <Button variant="ghost" size="sm" className="mt-2">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}