import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Trophy, 
  Users, 
  BookOpen, 
  Camera, 
  MapPin, 
  Star, 
  Shield,
  TrendingUp,
  Clock,
  Award,
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function UserGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Elite Athlete's Guide to Grapplr
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Master the platform to maximize your martial arts journey
        </p>
        <Badge variant="outline" className="text-orange-600 border-orange-600">
          For Serious Athletes Only
        </Badge>
      </div>

      {/* Quick Start Section */}
      <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
            <Zap className="h-5 w-5" />
            Quick Start for Elite Athletes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/profile-edit">
              <Button className="w-full h-auto p-4 bg-orange-600 hover:bg-orange-700">
                <div className="text-center">
                  <Target className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">1. Optimize Profile</div>
                  <div className="text-xs opacity-90">Your fighting resume</div>
                </div>
              </Button>
            </Link>
            <Link href="/my-profile">
              <Button className="w-full h-auto p-4" variant="outline">
                <div className="text-center">
                  <BookOpen className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">2. Start Journal</div>
                  <div className="text-xs opacity-90">Track every session</div>
                </div>
              </Button>
            </Link>
            <Link href="/explore">
              <Button className="w-full h-auto p-4" variant="outline">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">3. Find Partners</div>
                  <div className="text-xs opacity-90">Build your network</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <div className="space-y-8">
        {/* Profile Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Profile Optimization (Critical First Step)
            </CardTitle>
            <p className="text-muted-foreground">
              Your profile is your fighting resume. Elite athletes demand precision in every detail.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Essential Information
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Role:</strong> Member (student) or Instructor (coach)</li>
                  <li><strong>Skill Level:</strong> Honest assessment of your abilities</li>
                  <li><strong>Belt Rank:</strong> Current ranking in primary discipline</li>
                  <li><strong>Gym Affiliation:</strong> Your training facility</li>
                  <li><strong>Location:</strong> Precise location for partner matching</li>
                  <li><strong>Bio:</strong> 2-3 sentences about your fighting background</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pro Tip</h5>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Include competition history, certifications, or notable achievements. 
                  This builds credibility and attracts high-quality training partners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Journal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Training Journal System
            </CardTitle>
            <p className="text-muted-foreground">
              Document every session to accelerate improvement and track your evolution as a fighter.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Session Types to Track</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Technique Drilling</Badge>
                    <span className="text-sm">Focus on specific skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Sparring</Badge>
                    <span className="text-sm">Live rolling/fighting practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Conditioning</Badge>
                    <span className="text-sm">Strength and cardio work</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Competition Prep</Badge>
                    <span className="text-sm">Tournament-focused training</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Key Metrics</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Duration:</strong> Precise training time</li>
                  <li>• <strong>Techniques:</strong> Specific moves practiced</li>
                  <li>• <strong>Mood:</strong> Pre/post-training mental state</li>
                  <li>• <strong>Notes:</strong> What worked, what needs improvement</li>
                </ul>
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Elite Strategy:</strong> Review your journal weekly to identify patterns and improvement areas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              Training Media Documentation
            </CardTitle>
            <p className="text-muted-foreground">
              Build your technical library for analysis and improvement.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Upload Strategy</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Sparring Footage:</strong> Review live rolls for technical analysis</li>
                  <li>• <strong>Technique Demos:</strong> Document new moves learned</li>
                  <li>• <strong>Competition Footage:</strong> Archive tournament performances</li>
                  <li>• <strong>Training Highlights:</strong> Key breakthrough moments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Technical Details</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Use descriptive titles with dates</li>
                  <li>• Tag specific techniques for searchability</li>
                  <li>• Add detailed descriptions for future reference</li>
                  <li>• Set public/private based on sharing preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Advanced Features for Elite Athletes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-lg">🧠</span>
                  </div>
                  <h4 className="font-semibold">AI Matching</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced algorithm analyzes skill level, goals, location, and fighting style for optimal partner matching.
                </p>
                <Link href="/recommendations">
                  <Button size="sm" className="w-full">
                    Find Matches
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold">Instructor Notes</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Track detailed feedback from coaches and monitor your technical development over time.
                </p>
                <Link href="/instructor-notes">
                  <Button size="sm" variant="outline" className="w-full">
                    View Notes
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Gym Discovery</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Find specialized training facilities with geolocation search and quality ratings.
                </p>
                <Link href="/gym-finder">
                  <Button size="sm" variant="outline" className="w-full">
                    Find Gyms
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Success Metrics for Elite Athletes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Monthly Assessments
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Training frequency (sessions per week)</li>
                  <li>• Skill development (new techniques mastered)</li>
                  <li>• Network growth (quality connections made)</li>
                  <li>• Competition readiness level</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Quarterly Reviews
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Goal achievement progress</li>
                  <li>• Community contribution impact</li>
                  <li>• Skill validation from instructors</li>
                  <li>• Competition performance analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
              <Shield className="h-5 w-5" />
              Pro Tips for Maximum Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Consistency Standards</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Log sessions immediately after training</li>
                  <li>• Update availability weekly</li>
                  <li>• Respond to requests within 24 hours</li>
                  <li>• Maintain active community engagement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Quality Focus</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Connect only with serious athletes</li>
                  <li>• Provide detailed, constructive feedback</li>
                  <li>• Maintain professional communication</li>
                  <li>• Respect facility rules and training etiquette</li>
                </ul>
              </div>
            </div>
            <hr className="my-4 border-orange-200 dark:border-orange-800" />
            <div className="text-center">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2">
                Remember: Grapplr enhances your martial arts journey
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Your dedication, consistency, and commitment to excellence determine your success.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Link href="/profile-edit">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Target className="h-4 w-4 mr-2" />
              Complete Your Profile
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Start Connecting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}