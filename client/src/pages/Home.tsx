import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, User } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  console.log("Home component rendering with user:", user);

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>({
    queryKey: ["/api/ratings/stats"],
  });

  console.log("Home stats:", { stats, statsLoading, statsError });

  // Force render with explicit styling
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'hsl(210, 20%, 98%)', 
      color: 'hsl(210, 24%, 16%)',
      padding: '2rem'
    }}>
      <div className="container mx-auto">
        {/* Welcome Section - Always visible */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: 'hsl(210, 24%, 16%)'
          }}>
            Welcome back, {user?.firstName || 'Fighter'}! 🥋
          </h1>
          <p style={{ 
            color: 'hsl(215, 16%, 47%)', 
            fontSize: '1.125rem' 
          }}>
            Connect with the Jiu-Jitsu community in Longwood & Orlando
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'hsl(210, 65%, 26%)' 
            }}>
              {statsLoading ? "..." : (stats?.averageRating?.toFixed(1) || "0.0")}
            </div>
            <div style={{ color: 'hsl(215, 16%, 47%)' }}>Average Rating</div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'hsl(210, 65%, 26%)' 
            }}>
              {statsLoading ? "..." : (stats?.totalReviews || 0)}
            </div>
            <div style={{ color: 'hsl(215, 16%, 47%)' }}>Total Reviews</div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'hsl(210, 65%, 26%)' 
            }}>
              {statsLoading ? "..." : (stats?.activeMembers || 0)}
            </div>
            <div style={{ color: 'hsl(215, 16%, 47%)' }}>Active Members</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Users size={20} style={{ color: 'hsl(210, 65%, 26%)' }} />
              Find Training Partners
            </h3>
            <p style={{ 
              color: 'hsl(215, 16%, 47%)', 
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              Connect with other martial artists in your area
            </p>
            <Link href="/explore">
              <button style={{
                width: '100%',
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                Explore Community 🔍
              </button>
            </Link>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Star size={20} style={{ color: 'hsl(210, 65%, 26%)' }} />
              Rate & Review
            </h3>
            <p style={{ 
              color: 'hsl(215, 16%, 47%)', 
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              Share your training experiences with others
            </p>
            <Link href="/ratings">
              <button style={{
                width: '100%',
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                View Ratings ⭐
              </button>
            </Link>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <User size={20} style={{ color: 'hsl(210, 65%, 26%)' }} />
              My Profile
            </h3>
            <p style={{ 
              color: 'hsl(215, 16%, 47%)', 
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              Manage your profile and training journal
            </p>
            <Link href="/my-profile">
              <button style={{
                width: '100%',
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                View Profile 👤
              </button>
            </Link>
          </div>
        </div>

        {/* Debug info */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem' 
          }}>
            Debug Info
          </h3>
          <div style={{ fontSize: '0.875rem' }}>
            <p>User authenticated: {user ? "Yes" : "No"}</p>
            <p>User ID: {user?.id || "None"}</p>
            <p>User name: {user?.firstName} {user?.lastName}</p>
            <p>Stats loading: {statsLoading ? "Yes" : "No"}</p>
            <p>Stats error: {statsError ? String(statsError) : "None"}</p>
            <p>Stats data: {JSON.stringify(stats)}</p>
            <p>Current time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}