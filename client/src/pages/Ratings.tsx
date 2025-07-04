import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StarRating from "@/components/StarRating";
import { Link } from "wouter";
import { UserWithProfile } from "@shared/schema";

export default function Ratings() {
  const { data: stats } = useQuery({
    queryKey: ["/api/ratings/stats"],
  });

  const { data: topRatedUsers } = useQuery({
    queryKey: ["/api/ratings/top-rated"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Community Ratings</h2>
      
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
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
        </div>

        {/* Top Rated Members Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Members</CardTitle>
            </CardHeader>
            <CardContent>
              {topRatedUsers && topRatedUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Gym</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Reviews</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topRatedUsers.map((user: UserWithProfile) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <Link href={`/profile/${user.id}`} className="font-semibold hover:underline">
                                {user.firstName} {user.lastName}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.profile && (
                              <Badge className="badge-role">
                                {user.profile.role}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.profile?.gymAffiliation || "—"}
                          </TableCell>
                          <TableCell>
                            {user.profile?.location || "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StarRating 
                                rating={user.averageRating || 0} 
                                readonly 
                                size="sm"
                              />
                              <span className="text-sm font-medium">
                                {user.averageRating?.toFixed(1) || "0.0"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.ratingCount || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No ratings available yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
