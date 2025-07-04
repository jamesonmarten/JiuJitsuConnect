import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Star } from "lucide-react";
import { Link } from "wouter";

export default function Explore() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    role: "",
    skillLevel: "",
  });

  const { data: users, isLoading } = useQuery<any[]>({
    queryKey: ["/api/users", filters],
  });

  console.log("Explore component data:", { users, isLoading });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Community</h1>
        <p className="text-muted-foreground">
          Connect with Jiu-Jitsu practitioners in Longwood & Orlando
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => setFilters({ ...filters, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="longwood">Longwood</SelectItem>
                    <SelectItem value="orlando">Orlando</SelectItem>
                    <SelectItem value="winter-park">Winter Park</SelectItem>
                    <SelectItem value="altamonte-springs">Altamonte Springs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => setFilters({ ...filters, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select
                  value={filters.skillLevel}
                  onValueChange={(value) => setFilters({ ...filters, skillLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({ search: "", location: "", role: "", skillLevel: "" })}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Community Members</h2>
            <span className="text-muted-foreground">
              {users?.length || 0} members found
            </span>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '3rem',
            textAlign: 'center'
          }}>
            {isLoading ? (
              <div>
                <div style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Loading community members...</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ 
                      backgroundColor: 'hsl(210, 40%, 96%)', 
                      height: '200px', 
                      borderRadius: '0.5rem',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}></div>
                  ))}
                </div>
              </div>
            ) : users && Array.isArray(users) && users.length === 0 ? (
              <div>
                <Users size={48} style={{ color: 'hsl(215, 16%, 47%)', margin: '0 auto 1rem auto' }} />
                <div style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1rem' }}>
                  No members found matching your criteria
                </div>
                <button 
                  style={{
                    backgroundColor: 'hsl(210, 65%, 26%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFilters({ search: "", location: "", role: "", skillLevel: "" })}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                    Found {Array.isArray(users) ? users.length : 0} community members
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {Array.isArray(users) && users.slice(0, 6).map((user: any) => (
                    <div key={user.id} style={{ 
                      backgroundColor: 'white', 
                      border: '1px solid hsl(214, 32%, 91%)',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <img 
                          src={user.profileImageUrl || "https://via.placeholder.com/80x80?text=👤"}
                          alt={user.firstName || "Member"}
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div style={{ flex: '1' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            {user.firstName || "Member"} {user.lastName || ""}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', marginBottom: '0.25rem' }}>
                            <MapPin size={16} />
                            {user.profile?.location || "Location not set"}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                            <Star size={16} />
                            {user.profile?.skillLevel || "Skill level not set"}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/profile/${user.id}`} style={{ flex: '1' }}>
                          <button style={{
                            width: '100%',
                            backgroundColor: 'white',
                            color: 'hsl(210, 65%, 26%)',
                            border: '1px solid hsl(214, 32%, 91%)',
                            borderRadius: '0.375rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}>
                            View Profile
                          </button>
                        </Link>
                        <button style={{
                          backgroundColor: 'hsl(210, 65%, 26%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}>
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {Array.isArray(users) && users.length === 0 && (
                  <div style={{ marginTop: '2rem', color: 'hsl(215, 16%, 47%)' }}>
                    No members in the community yet. Be the first to join!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}