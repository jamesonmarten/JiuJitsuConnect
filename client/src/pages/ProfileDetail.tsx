import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Star, Calendar, UserPlus, UserMinus, MessageSquare } from "lucide-react";
import StarRating from "@/components/StarRating";
import ContactModal from "@/components/ContactModal";
import RatingModal from "@/components/RatingModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserWithProfile } from "@shared/schema";

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // In real app, fetch from API
  const [mutualFollow, setMutualFollow] = useState(false); // If both users follow each other

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users", id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: ratings } = useQuery({
    queryKey: ["/api/ratings", id],
    queryFn: async () => {
      const response = await fetch(`/api/ratings/${id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch ratings");
      return response.json();
    },
    enabled: !!id,
  });

  // Follow/Unfollow mutations for business networking
  const followMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/follow/${id}`);
    },
    onSuccess: () => {
      setIsFollowing(true);
      toast({
        title: "Success",
        description: `You are now following ${user?.firstName} ${user?.lastName}`,
      });
      // In real app, you'd check for mutual follow status here
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to follow user",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/follow/${id}`);
    },
    onSuccess: () => {
      setIsFollowing(false);
      setMutualFollow(false);
      toast({
        title: "Success",
        description: `You unfollowed ${user?.firstName} ${user?.lastName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow user",
        variant: "destructive",
      });
    },
  });

  // Easter egg: Quick networking actions
  const handleEasterEggNetworking = () => {
    toast({
      title: "🚀 Power User Mode Activated!",
      description: "You've discovered the quick networking shortcut. Nice work!",
    });
    setIsFollowing(true);
    setMutualFollow(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-muted rounded-lg h-96"></div>
            <div className="lg:col-span-2 bg-muted rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">User not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <img 
                src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                alt={`${user.firstName} ${user.lastName}`}
                className="profile-avatar-large mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h2>
              {user.profile && (
                <>
                  <p className="text-muted-foreground mb-4">
                    {user.profile.role === 'instructor' ? 'Brazilian Jiu-Jitsu Instructor' : 'BJJ Practitioner'}
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge className="badge-role">{user.profile.role}</Badge>
                    <Badge className="badge-skill">{user.profile.skillLevel}</Badge>
                  </div>
                </>
              )}
              
              {user.averageRating && (
                <div className="mb-4">
                  <StarRating rating={user.averageRating} readonly />
                  <p className="text-sm text-muted-foreground mt-1">
                    ({user.averageRating.toFixed(1)}/5 from {user.ratingCount} reviews)
                  </p>
                </div>
              )}

              {!isOwnProfile && (
                <div className="space-y-2">
                  {/* Primary Contact Button */}
                  <Button 
                    className="w-full" 
                    onClick={() => setShowContactModal(true)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  
                  {/* Follow/Unfollow Button for Business Networking */}
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    className="w-full"
                    onClick={() => isFollowing ? unfollowMutation.mutate() : followMutation.mutate()}
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        {unfollowMutation.isPending ? "Unfollowing..." : "Unfollow"}
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {followMutation.isPending ? "Following..." : "Follow"}
                      </>
                    )}
                  </Button>

                  {/* Direct Message - Only if mutual follow */}
                  {mutualFollow && (
                    <Button 
                      variant="outline" 
                      className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Direct Message
                    </Button>
                  )}

                  {/* Rate Button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowRatingModal(true)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Rate This Member
                  </Button>

                  {/* Easter Egg Button */}
                  <div className="pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-primary"
                      onClick={handleEasterEggNetworking}
                      onDoubleClick={handleEasterEggNetworking}
                    >
                      🥋 Quick Connect
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {user.profile?.gymAffiliation && (
                  <div>
                    <h4 className="font-semibold mb-1">Gym Affiliation</h4>
                    <p className="text-muted-foreground">{user.profile.gymAffiliation}</p>
                  </div>
                )}
                {user.profile?.location && (
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.profile.location}
                    </p>
                  </div>
                )}
                {user.profile?.experience && (
                  <div>
                    <h4 className="font-semibold mb-1">Experience</h4>
                    <p className="text-muted-foreground">{user.profile.experience}</p>
                  </div>
                )}
                {user.profile?.beltRank && (
                  <div>
                    <h4 className="font-semibold mb-1">Belt Rank</h4>
                    <p className="text-muted-foreground">{user.profile.beltRank}</p>
                  </div>
                )}
              </div>
              {user.profile?.about && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-muted-foreground">{user.profile.about}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {user.profile?.location && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">{user.profile.location}</p>
                    <p className="text-sm text-muted-foreground">Training location</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reviews */}
          {ratings && ratings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratings.slice(0, 3).map((rating: any) => (
                    <div key={rating.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src={rating.fromUser?.profileImageUrl || `https://ui-avatars.com/api/?name=${rating.fromUser?.firstName}+${rating.fromUser?.lastName}`}
                            alt="Reviewer"
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-semibold">
                            {rating.fromUser?.firstName} {rating.fromUser?.lastName}
                          </span>
                        </div>
                        <StarRating rating={rating.rating} readonly size="sm" />
                      </div>
                      {rating.review && (
                        <p className="text-muted-foreground mb-2">{rating.review}</p>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        recipientName={`${user.firstName} ${user.lastName}`}
        recipientId={user.id}
      />
      <RatingModal 
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        recipientName={`${user.firstName} ${user.lastName}`}
        recipientId={user.id}
      />
    </div>
  );
}
