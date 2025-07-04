import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, User } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  console.log("Home component rendering with user:", user);

  const { data: stats, isLoading: statsLoading } = useQuery<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>({
    queryKey: ["/api/ratings/stats"],
  });

  console.log("Home stats:", { stats, statsLoading });

  return (
    <div className="container mx-auto px-4 py-8 bg-background min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Welcome back, Fighter! 🥋
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect with the Jiu-Jitsu community in Longwood & Orlando
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary">
              {statsLoading ? "..." : (stats?.averageRating?.toFixed(1) || "0.0")}
            </div>
            <div className="text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary">
              {statsLoading ? "..." : (stats?.totalReviews || 0)}
            </div>
            <div className="text-muted-foreground">Total Reviews</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-primary">
              {statsLoading ? "..." : (stats?.activeMembers || 0)}
            </div>
            <div className="text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Find Training Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with other martial artists in your area
            </p>
            <Link href="/explore">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Community 🔍
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Rate & Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Share your training experiences with others
            </p>
            <Link href="/ratings">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                View Ratings ⭐
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your profile and training journal
            </p>
            <Link href="/my-profile">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                View Profile 👤
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Debug info */}
      <Card className="mt-8 border-border bg-card">
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>User authenticated: {user ? "Yes" : "No"}</p>
            <p>User ID: {user?.id || "None"}</p>
            <p>Stats loading: {statsLoading ? "Yes" : "No"}</p>
            <p>Stats data: {JSON.stringify(stats)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}