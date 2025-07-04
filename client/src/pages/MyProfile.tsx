import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, BookOpen, Camera, Settings } from "lucide-react";
import { Link } from "wouter";

export default function MyProfile() {
  const { user } = useAuth();

  console.log("MyProfile rendering with user:", user);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'purple', 
      color: 'white',
      padding: '2rem',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div style={{ backgroundColor: 'orange', color: 'black', padding: '20px', margin: '20px' }}>
        MY PROFILE PAGE IS RENDERING - {new Date().toLocaleTimeString()}
      </div>
      <div className="container mx-auto">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: 'hsl(210, 24%, 16%)'
          }}>
            My Profile 👤
          </h1>
          <p style={{ 
            color: 'hsl(215, 16%, 47%)', 
            fontSize: '1.125rem' 
          }}>
            Manage your profile, training journal, and media gallery
          </p>
        </div>

        {/* Profile Overview */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <img 
              src={user?.profileImageUrl || "https://via.placeholder.com/100x100?text=👤"}
              alt={user?.firstName || "User"}
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '3px solid hsl(214, 32%, 91%)'
              }}
            />
            <div style={{ flex: '1' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {user?.firstName || "User"} {user?.lastName || ""}
              </h2>
              <p style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '0.5rem' }}>
                {user?.email || "Email not available"}
              </p>
              <div style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
                Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </div>
            </div>
            <Link href="/profile-edit">
              <button style={{
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Edit size={16} />
                Edit Profile
              </button>
            </Link>
          </div>

          {!user?.profile && (
            <div style={{ 
              backgroundColor: 'hsl(32, 98%, 95%)', 
              border: '1px solid hsl(32, 98%, 80%)',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ color: 'hsl(32, 98%, 35%)', fontWeight: '600', marginBottom: '0.5rem' }}>
                Complete Your Profile
              </div>
              <div style={{ color: 'hsl(32, 98%, 35%)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Add your training information to connect with other martial artists in the community.
              </div>
              <Link href="/profile-edit">
                <button style={{
                  backgroundColor: 'hsl(32, 98%, 48%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  Complete Profile
                </button>
              </Link>
            </div>
          )}
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
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <BookOpen size={32} style={{ color: 'hsl(210, 65%, 26%)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Training Journal
            </h3>
            <p style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Track your training sessions, mood, and progress
            </p>
            <button style={{
              backgroundColor: 'hsl(210, 65%, 26%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              width: '100%'
            }}>
              Add Journal Entry
            </button>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Camera size={32} style={{ color: 'hsl(210, 65%, 26%)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Training Media
            </h3>
            <p style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Upload photos and videos from your sparring sessions
            </p>
            <button style={{
              backgroundColor: 'hsl(210, 65%, 26%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              width: '100%'
            }}>
              Upload Media
            </button>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(214, 32%, 91%)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Settings size={32} style={{ color: 'hsl(210, 65%, 26%)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Profile Settings
            </h3>
            <p style={{ color: 'hsl(215, 16%, 47%)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Update your profile information and preferences
            </p>
            <Link href="/profile-edit">
              <button style={{
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                width: '100%'
              }}>
                Edit Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Recent Activity
          </h3>
          <div style={{ color: 'hsl(215, 16%, 47%)', marginBottom: '1.5rem' }}>
            No recent activity to show. Start by completing your profile or adding a journal entry!
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile-edit">
              <button style={{
                backgroundColor: 'hsl(210, 65%, 26%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Complete Profile
              </button>
            </Link>
            <Link href="/explore">
              <button style={{
                backgroundColor: 'white',
                color: 'hsl(210, 65%, 26%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '0.375rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Explore Community
              </button>
            </Link>
          </div>
        </div>

        {/* Debug Info */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Debug Info
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'hsl(215, 16%, 47%)' }}>
            <p>User ID: {user?.id || "Not available"}</p>
            <p>Has Profile: {user?.profile ? "Yes" : "No"}</p>
            <p>Page rendered at: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}