import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Users, Search } from "lucide-react";
import type { UserWithProfile } from "@shared/schema";

export default function Explore() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    role: "",
    skillLevel: "",
  });

  const { data: users = [], isLoading } = useQuery<UserWithProfile[]>({
    queryKey: ["/api/users", filters],
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Discover Training Partners
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with fellow martial artists in your area
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <Input
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
            <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.skillLevel} onValueChange={(value) => handleFilterChange("skillLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                    {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.email?.split('@')[0] || 'Unknown User'
                      }
                    </h3>
                    {user.profile?.role && (
                      <Badge variant={user.profile.role === 'instructor' ? 'default' : 'secondary'}>
                        {user.profile.role}
                      </Badge>
                    )}
                  </div>
                  
                  {user.profile?.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.profile.location}
                    </div>
                  )}
                  
                  {user.profile?.skillLevel && (
                    <div className="text-sm">
                      <span className="font-medium">Skill:</span> {user.profile.skillLevel}
                    </div>
                  )}
                  
                  {user.profile?.beltRank && (
                    <div className="text-sm">
                      <span className="font-medium">Belt:</span> {user.profile.beltRank}
                    </div>
                  )}
                  
                  {user.averageRating && user.ratingCount && (
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {user.averageRating.toFixed(1)} ({user.ratingCount} reviews)
                    </div>
                  )}
                </div>
              </div>
              
              {user.profile?.about && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 line-clamp-3">
                  {user.profile.about}
                </p>
              )}
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" variant="outline">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && !isLoading && (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No members found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search filters or be the first to create a profile!
          </p>
        </Card>
      )}
    </div>
  );
}