import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users, Award } from "lucide-react";
import { Link } from "wouter";

export default function Ratings() {
  const { data: stats, isLoading: statsLoading } = useQuery<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>({
    queryKey: ["/api/ratings/stats"],
  });

  const { data: topUsers, isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/users", { limit: 10 }],
  });

  console.log("Ratings page data:", { stats, topUsers });

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
            Community Ratings & Reviews ⭐
          </h1>
          <p style={{ 
            color: 'hsl(215, 16%, 47%)', 
            fontSize: '1.125rem' 
          }}>
            See how our community members rate their training experiences
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Star style={{ color: 'hsl(32, 98%, 48%)' }} size={24} />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {statsLoading ? "..." : (stats?.averageRating?.toFixed(1) || "0.0")}
              </span>
            </div>
            <div style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem' }}>
              Average Community Rating
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <TrendingUp style={{ color: 'hsl(142, 76%, 36%)' }} size={24} />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {statsLoading ? "..." : (stats?.totalReviews || 0)}
              </span>
            </div>
            <div style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem' }}>
              Total Reviews
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Users style={{ color: 'hsl(210, 65%, 26%)' }} size={24} />
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {statsLoading ? "..." : (stats?.activeMembers || 0)}
              </span>
            </div>
            <div style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem' }}>
              Active Members
            </div>
          </div>
        </div>

        {/* Top Rated Members */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Award style={{ color: 'hsl(32, 98%, 48%)' }} size={24} />
            Top Rated Community Members
          </h2>
          
          {usersLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.125rem', color: 'hsl(215, 16%, 47%)' }}>
                Loading top rated members...
              </div>
            </div>
          ) : topUsers && Array.isArray(topUsers) && topUsers.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}>
              {topUsers.slice(0, 6).map((user: any, index: number) => (
                <div key={user.id} style={{ 
                  backgroundColor: 'hsl(210, 40%, 98%)', 
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    color: index < 3 ? 'hsl(32, 98%, 48%)' : 'hsl(215, 16%, 47%)',
                    marginBottom: '0.5rem'
                  }}>
                    #{index + 1}
                  </div>
                  <img 
                    src={user.profileImageUrl || "https://via.placeholder.com/60x60?text=👤"}
                    alt={user.firstName || "Member"}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      margin: '0 auto 0.5rem auto'
                    }}
                  />
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {user.firstName || "Member"} {user.lastName || ""}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.5rem'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        style={{ color: i < (user.averageRating || 0) ? 'hsl(32, 98%, 48%)' : 'hsl(210, 40%, 96%)' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(215, 16%, 47%)' }}>
                    {user.ratingCount || 0} reviews
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Star size={48} style={{ color: 'hsl(215, 16%, 47%)', margin: '0 auto 1rem auto' }} />
              <div style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1rem' }}>
                No ratings yet. Be the first to rate a training partner!
              </div>
              <Link href="/explore">
                <button style={{
                  backgroundColor: 'hsl(210, 65%, 26%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}>
                  Find Training Partners
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Ready to connect with the community?
          </h3>
          <p style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1.5rem' }}>
            Explore our community members and start building your training network today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/explore">
              <button style={{
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Explore Community
              </button>
            </Link>
            <Link href="/my-profile">
              <button style={{
                backgroundColor: 'white',
                color: 'hsl(210, 65%, 26%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Manage My Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}