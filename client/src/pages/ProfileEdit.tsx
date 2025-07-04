import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProfileEdit() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    role: user?.profile?.role || "",
    skillLevel: user?.profile?.skillLevel || "",
    gymAffiliation: user?.profile?.gymAffiliation || "",
    location: user?.profile?.location || "",
    beltRank: user?.profile?.beltRank || "",
    bio: user?.profile?.bio || "",
    trainingGoals: user?.profile?.trainingGoals || "",
    availability: user?.profile?.availability || "",
  });

  console.log("ProfileEdit rendering with user:", user);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Implement form submission
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'hsl(210, 20%, 98%)', 
      color: 'hsl(210, 24%, 16%)',
      padding: '2rem'
    }}>
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/my-profile">
              <button style={{
                backgroundColor: 'white',
                color: 'hsl(210, 65%, 26%)',
                border: '1px solid hsl(214, 32%, 91%)',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <ArrowLeft size={16} />
              </button>
            </Link>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              color: 'hsl(210, 24%, 16%)'
            }}>
              Edit Profile ✏️
            </h1>
          </div>
          <p style={{ 
            color: 'hsl(215, 16%, 47%)', 
            fontSize: '1.125rem' 
          }}>
            Update your training information to connect with the community
          </p>
        </div>

        {/* Profile Form */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Role */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your role</option>
                  <option value="member">Member</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Skill Level *
                </label>
                <select
                  value={formData.skillLevel}
                  onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your skill level</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="advanced">Advanced (5+ years)</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your location</option>
                  <optgroup label="Florida">
                    <option value="miami">Miami</option>
                    <option value="tampa">Tampa</option>
                    <option value="orlando">Orlando</option>
                    <option value="jacksonville">Jacksonville</option>
                    <option value="fort-lauderdale">Fort Lauderdale</option>
                    <option value="tallahassee">Tallahassee</option>
                    <option value="gainesville">Gainesville</option>
                    <option value="pensacola">Pensacola</option>
                    <option value="west-palm-beach">West Palm Beach</option>
                    <option value="fort-myers">Fort Myers</option>
                    <option value="longwood">Longwood</option>
                    <option value="winter-park">Winter Park</option>
                    <option value="altamonte-springs">Altamonte Springs</option>
                    <option value="casselberry">Casselberry</option>
                    <option value="lake-mary">Lake Mary</option>
                  </optgroup>
                  <optgroup label="Wisconsin">
                    <option value="milwaukee">Milwaukee</option>
                    <option value="madison">Madison</option>
                    <option value="green-bay">Green Bay</option>
                    <option value="kenosha">Kenosha</option>
                    <option value="racine">Racine</option>
                    <option value="appleton">Appleton</option>
                    <option value="waukesha">Waukesha</option>
                    <option value="eau-claire">Eau Claire</option>
                    <option value="oshkosh">Oshkosh</option>
                    <option value="janesville">Janesville</option>
                  </optgroup>
                  <optgroup label="Illinois">
                    <option value="chicago">Chicago</option>
                    <option value="aurora">Aurora</option>
                    <option value="naperville">Naperville</option>
                    <option value="joliet">Joliet</option>
                    <option value="rockford">Rockford</option>
                    <option value="elgin">Elgin</option>
                    <option value="peoria">Peoria</option>
                    <option value="champaign">Champaign</option>
                    <option value="waukegan">Waukegan</option>
                    <option value="cicero">Cicero</option>
                  </optgroup>
                </select>
              </div>

              {/* Gym Affiliation */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Gym/School Affiliation
                </label>
                <input
                  type="text"
                  value={formData.gymAffiliation}
                  onChange={(e) => handleInputChange('gymAffiliation', e.target.value)}
                  placeholder="e.g., Orlando BJJ Academy"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Belt Rank */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Belt Rank
                </label>
                <select
                  value={formData.beltRank}
                  onChange={(e) => handleInputChange('beltRank', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your belt rank</option>
                  <option value="white">White Belt</option>
                  <option value="blue">Blue Belt</option>
                  <option value="purple">Purple Belt</option>
                  <option value="brown">Brown Belt</option>
                  <option value="black">Black Belt</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell the community about yourself, your martial arts journey, and what you're looking for..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Training Goals */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Training Goals
                </label>
                <textarea
                  value={formData.trainingGoals}
                  onChange={(e) => handleInputChange('trainingGoals', e.target.value)}
                  placeholder="What are your training goals? e.g., improve guard, prepare for competition, stay in shape..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Availability */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: 'hsl(210, 24%, 16%)'
                }}>
                  Training Availability
                </label>
                <textarea
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  placeholder="When are you usually available for training? e.g., Weekday evenings, Saturday mornings..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid hsl(214, 32%, 91%)'
            }}>
              <Link href="/my-profile">
                <button type="button" style={{
                  backgroundColor: 'white',
                  color: 'hsl(210, 65%, 26%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '0.375rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  Cancel
                </button>
              </Link>
              <button type="submit" style={{
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
                <Save size={16} />
                Save Profile
              </button>
            </div>
          </form>
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
            <p>Current Profile: {user?.profile ? "Exists" : "None"}</p>
            <p>Form Data: {JSON.stringify(formData, null, 2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}