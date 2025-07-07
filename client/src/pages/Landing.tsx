import { Button } from "@/components/ui/button";
import { Users, Star, MapPin, Camera, Book, Award, Zap, Target, Trophy, BookOpen, Play } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] repeat"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-orange-300 mb-1">MMA Connect</h2>
                <p className="text-lg text-orange-200">by Dev Cabin Technologies</p>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                  Dominate the Mat
                </span>
                <br />
                <span className="text-white">
                  Connect. Train. Conquer.
                </span>
              </h1>
              <p className="text-xl mb-6 text-gray-200 leading-relaxed max-w-2xl">
                The premier MMA and Jiu-Jitsu community platform connecting elite fighters across Central Florida and Southeastern Wisconsin. 
                Find training partners, track your evolution, and forge your path to greatness.
              </p>
              
              <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-8 max-w-2xl">
                <p className="text-orange-200 text-sm font-medium">
                  🚀 <strong>Rapidly Expanding Due to Popular Demand!</strong> Now serving Central Florida and Southeastern Wisconsin with new locations launching monthly.
                </p>
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-orange-300">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">500+ Athletes</span>
                </div>
                <div className="flex items-center gap-2 text-orange-300">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-medium">2 States</span>
                </div>
                <div className="flex items-center gap-2 text-orange-300">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-sm font-medium">Expanding Fast</span>
                </div>
              </div>
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
                  onClick={() => window.location.href = '/lessons'}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-none shadow-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Free Lessons
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
            <div className="relative overflow-hidden rounded-xl">
              <div className="relative h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <img 
                  src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?ixlib=rb-4.0.3&w=800&h=600&fit=crop" 
                  alt="Professional MMA training facility" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Professional Training Message */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-orange-500 rounded-full p-3">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Professional Training Network
                    </h3>
                    <p className="text-white/90 mb-4">
                      Connect with certified instructors, elite athletes, and serious practitioners across Central Florida and Southeastern Wisconsin.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-orange-300">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Elite Network Access</span>
                    </div>
                  </div>
                </div>

                {/* Professional Badges */}
                <div className="absolute top-4 right-4">
                  <div className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-semibold">
                    <Award className="inline h-4 w-4 mr-1" />
                    Verified Athletes Only
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    FL & WI - Expanding Nationwide
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Lessons Promotion */}
      <div className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Learn from World Champions - Completely Free
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Get exclusive access to premium training content from experienced martial arts experts and certified instructors. 
              All lessons are completely free - no hidden fees, no subscriptions required.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">10+ Free Lessons</h3>
              <p className="opacity-90">Complete techniques from beginner to advanced</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">World Champions</h3>
              <p className="opacity-90">Learn from the best fighters in the world</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">HD Quality</h3>
              <p className="opacity-90">Crystal clear video with multiple camera angles</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/lessons'}
              className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning Now - Free
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Forge Your Fighting Future</h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Join the elite network fighters and trainers across Central Florida & Southeastern Wisconsin
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 border-none shadow-lg px-8 py-3 text-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Training Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/guide'}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Elite Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with Company Branding */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🥋</span>
                <div>
                  <h3 className="font-bold text-xl">MMA Connect</h3>
                  <p className="text-gray-400">by Dev Cabin Technologies</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Connecting elite martial artists across Central Florida and Southeastern Wisconsin. 
                Professional-grade platform for serious fighters - expanding nationwide due to popular demand.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/guide" className="hover:text-orange-400 transition-colors">Elite Guide</a></li>
                <li><a href="/api/login" className="hover:text-orange-400 transition-colors">Join Community</a></li>
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Dev Cabin Technologies</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a 
                    href="https://devcabin.tech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Visit Our Website
                  </a>
                </li>
                <li>
                  <a 
                    href="https://devcabin.tech/portfolio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors"
                  >
                    View Portfolio
                  </a>
                </li>
                <li>
                  <a 
                    href="https://devcabin.tech/contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-700 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Dev Cabin Technologies. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a 
                href="https://devcabin.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
              >
                Powered by DCT
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
