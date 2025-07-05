import { Button } from "@/components/ui/button";
import { Users, Star, MapPin, Camera, Book, Award, Zap, Target, Trophy } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <div className="hero-section text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                  Dominate the Mat
                </span>
                <br />
                <span className="text-white">
                  Connect. Train. Conquer.
                </span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                The ultimate MMA and Jiu-Jitsu community platform for Orlando fighters. 
                Find elite training partners, track your evolution, and forge your path to greatness.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-blue-600 text-white hover:bg-blue-700 border-none shadow-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.location.href = '/api/login'}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?ixlib=rb-4.0.3&w=600&h=400&fit=crop" 
                alt="MMA fighters sparring in octagon" 
                className="rounded-lg shadow-2xl relative z-10"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-black/70 text-white px-3 py-1 rounded text-sm font-semibold">
                  <Zap className="inline h-4 w-4 mr-1" />
                  Elite Training Awaits
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Forge Your Fighting Future</h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Join the elite network of Orlando's most dedicated fighters and trainers
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Elite Training Partners</h3>
            <p className="text-muted-foreground">
              Connect with skilled fighters and world-class instructors. Match by skill level, weight class, and training goals.
            </p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
            <p className="text-muted-foreground">
              Track your wins, analyze your progression, and get rated by training partners and coaches.
            </p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Orlando Fight Hub</h3>
            <p className="text-muted-foreground">
              Discover the best gyms, training facilities, and fight events across Central Florida.
            </p>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 border border-orange-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-center mb-2 text-white">Advanced Fighter Tools</h3>
            <p className="text-center text-orange-200 mb-8">Professional-grade features for serious athletes</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Book className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Fight Journal</h4>
                <p className="text-orange-200 text-sm">
                  Log training sessions, track techniques mastered, and monitor your mental game progression.
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Combat Footage</h4>
                <p className="text-orange-200 text-sm">
                  Archive your sparring footage, highlight reel moments, and technique breakdowns for analysis.
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Coach Feedback</h4>
                <p className="text-orange-200 text-sm">
                  Get detailed performance reviews and strategic guidance from certified MMA instructors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to Level Up Your Training?</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Join Orlando's most elite MMA community and start your journey to greatness today.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 border-none shadow-lg px-8 py-3 text-lg"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Training Now
          </Button>
        </div>
      </div>
    </div>
  );
}
