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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'hsl(210, 20%, 98%)', 
      color: 'hsl(210, 24%, 16%)',
      padding: '2rem'
    }}>
      <div className="container mx-auto">
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: 'hsl(210, 24%, 16%)'
          }}>
            Explore Community 🥋
          </h1>
          <p style={{ 
            color: 'hsl(215, 16%, 47%)', 
            fontSize: '1.125rem' 
          }}>
            Connect with Jiu-Jitsu practitioners in Longwood & Orlando
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Search & Filter
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'hsl(210, 24%, 16%)'
              }}>
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'hsl(210, 24%, 16%)'
              }}>
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Locations</option>
                <option value="longwood">Longwood</option>
                <option value="orlando">Orlando</option>
                <option value="winter-park">Winter Park</option>
                <option value="altamonte-springs">Altamonte Springs</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'hsl(210, 24%, 16%)'
              }}>
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Roles</option>
                <option value="member">Member</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'hsl(210, 24%, 16%)'
              }}>
                Skill Level
              </label>
              <select
                value={filters.skillLevel}
                onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button 
              style={{
                backgroundColor: 'white',
                color: 'hsl(210, 65%, 26%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
              onClick={() => setFilters({ search: "", location: "", role: "", skillLevel: "" })}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Community Members</h2>
            <span style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem' }}>
              {Array.isArray(users) ? users.length : 0} members found
            </span>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Loading community members...</div>
            </div>
          ) : users && Array.isArray(users) && users.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {users.map((user: any) => (
                <div key={user.id} style={{ 
                  backgroundColor: 'hsl(210, 40%, 98%)', 
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.5rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img 
                      src={user.profileImageUrl || "https://via.placeholder.com/60x60?text=👤"}
                      alt={user.firstName || "Member"}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: '1' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {user.firstName || "Member"} {user.lastName || ""}
                      </h3>
                      <div style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)', marginBottom: '0.25rem' }}>
                        📍 {user.profile?.location || "Location not set"}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                        ⭐ {user.profile?.skillLevel || "Skill level not set"}
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
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
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
          )}
        </div>
      </div>
    </div>
  );
}