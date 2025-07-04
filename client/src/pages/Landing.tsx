import { Button } from "@/components/ui/button";
import { Users, Star, MapPin, Camera, Book, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <div className="hero-section text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Connect with the Jiu-Jitsu Community 🥋
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Find training partners, instructors, and gyms in Longwood, Orlando, and surrounding areas. 
                Track your progress, share your journey, and build your martial arts network today.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.location.href = '/api/login'}
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&w=600&h=400&fit=crop" 
                alt="Jiu-Jitsu training session" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Makes Grapplr Special</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Find Training Partners</h3>
            <p className="text-muted-foreground">
              Connect with members and instructors in your area based on skill level and location.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rate & Review</h3>
            <p className="text-muted-foreground">
              Share your experiences and help others find the best training opportunities.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Local Focus</h3>
            <p className="text-muted-foreground">
              Specifically designed for the Longwood, Orlando, and surrounding Central Florida area.
            </p>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="bg-card rounded-xl p-8 border">
          <h3 className="text-2xl font-bold text-center mb-8">Enhanced Profile Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Training Journal</h4>
              <p className="text-muted-foreground text-sm">
                Track your progress, mood, and training sessions with detailed personal notes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Media Gallery</h4>
              <p className="text-muted-foreground text-sm">
                Upload photos and videos from sparring sessions with technique tagging.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Instructor Notes</h4>
              <p className="text-muted-foreground text-sm">
                Receive personalized feedback and progress notes from your instructors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
