import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  Users, 
  Target, 
  Clock, 
  MapPin, 
  Star, 
  Sparkles,
  RefreshCw,
  Calendar,
  Trophy,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";

interface TrainingPartnerRecommendation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      role: string;
      skillLevel: string;
      location: string;
      beltRank: string;
      bio: string;
      gymAffiliation: string;
    };
    averageRating?: number;
    ratingCount: number;
  };
  compatibilityScore: number;
  reasons: string[];
  suggestedTrainingActivities: string[];
}

interface TrainingPlan {
  plan: string[];
  focus: string;
  duration: string;
}

export default function Recommendations() {
  const { toast } = useToast();
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  // Fetch AI recommendations
  const { data: recommendations = [], isLoading: loadingRecommendations, refetch } = useQuery<TrainingPartnerRecommendation[]>({
    queryKey: ["/api/recommendations"],
    queryFn: async () => {
      const response = await fetch('/api/recommendations', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
  });

  // Generate training plan mutation
  const trainingPlanMutation = useMutation({
    mutationFn: async (partnerId?: string): Promise<TrainingPlan> => {
      const response = await apiRequest("POST", "/api/training-plan", { partnerId });
      const data = await response.json();
      return data;
    },
    onSuccess: (data: TrainingPlan) => {
      toast({
        title: "🎯 Training Plan Generated!",
        description: `AI created a ${data.duration} plan focused on ${data.focus.toLowerCase()}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate training plan",
        variant: "destructive",
      });
    },
  });

  const handleGenerateTrainingPlan = (partnerId?: string) => {
    setSelectedPartner(partnerId || null);
    trainingPlanMutation.mutate(partnerId);
  };

  const handleRefreshRecommendations = () => {
    refetch();
    toast({
      title: "🔄 Refreshing Recommendations",
      description: "AI is analyzing updated community data for better matches",
    });
  };

  if (loadingRecommendations) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Training Partner Recommendations</h1>
          <p className="text-muted-foreground">Our AI is analyzing the community to find your perfect training matches...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Training Partner Recommendations</h1>
        <p className="text-muted-foreground mb-4">
          Personalized matches based on your skill level, goals, and training preferences
        </p>
        <Button 
          onClick={handleRefreshRecommendations}
          variant="outline" 
          size="sm"
          className="mb-6"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Recommendations
        </Button>
      </div>

      {/* Training Plan Section */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
            AI Training Plan Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Get a personalized training plan created by AI based on your profile and goals.
              </p>
              <Button 
                onClick={() => handleGenerateTrainingPlan()}
                disabled={trainingPlanMutation.isPending}
                className="w-full md:w-auto"
              >
                <Target className="h-4 w-4 mr-2" />
                {trainingPlanMutation.isPending ? "Generating..." : "Generate Solo Plan"}
              </Button>
            </div>
            
            {trainingPlanMutation.data && (
              <Card className="bg-white">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Your Training Plan
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Focus: {trainingPlanMutation.data.focus} • Duration: {trainingPlanMutation.data.duration}
                  </p>
                  <ul className="text-sm space-y-1">
                    {trainingPlanMutation.data.plan.slice(0, 3).map((activity, index) => (
                      <li key={index} className="flex items-center">
                        <Trophy className="h-3 w-3 mr-2 text-green-600" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      {recommendations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Recommendations Available</h3>
            <p className="text-muted-foreground mb-4">
              Complete your profile to get AI-powered training partner recommendations
            </p>
            <Link href="/profile-edit">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <Card key={recommendation.user.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {recommendation.user.firstName[0]}{recommendation.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {recommendation.user.firstName} {recommendation.user.lastName}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant={recommendation.user.profile.role === 'instructor' ? 'default' : 'secondary'}>
                          {recommendation.user.profile.role}
                        </Badge>
                        <Badge variant="outline">{recommendation.user.profile.skillLevel}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Match
                    </div>
                    <div className="font-bold text-lg text-primary">
                      {recommendation.compatibilityScore}%
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={recommendation.compatibilityScore} 
                  className="h-2 mt-2" 
                />
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* User Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {recommendation.user.profile.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="h-3 w-3 mr-1" />
                    {recommendation.user.profile.beltRank} belt
                  </div>
                  {recommendation.user.averageRating && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {recommendation.user.averageRating.toFixed(1)} ({recommendation.user.ratingCount} reviews)
                    </div>
                  )}
                </div>

                <Separator />

                {/* AI Reasons */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <Brain className="h-3 w-3 mr-1" />
                    Why This Match?
                  </h4>
                  <ul className="text-sm space-y-1">
                    {recommendation.reasons.map((reason, reasonIndex) => (
                      <li key={reasonIndex} className="flex items-start">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Activities */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    Suggested Activities
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.suggestedTrainingActivities.map((activity, activityIndex) => (
                      <Badge key={activityIndex} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/profile/${recommendation.user.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  <Button 
                    size="sm"
                    onClick={() => handleGenerateTrainingPlan(recommendation.user.id)}
                    disabled={trainingPlanMutation.isPending}
                    className="flex-1"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Plan Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Disclaimer */}
      <Card className="mt-8 bg-gray-50 border-dashed">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            <Brain className="h-3 w-3 inline mr-1" />
            Recommendations powered by AI analysis of community profiles, training goals, and compatibility factors.
            Results may vary based on individual preferences and availability.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}