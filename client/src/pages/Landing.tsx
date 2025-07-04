import { Button } from "@/components/ui/button";
import { Users, Star, MapPin } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <div className="hero-section text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Connect with the Jiu-Jitsu Community
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Find training partners, instructors, and gyms in Longwood, Orlando, and surrounding areas. 
                Build your martial arts network today.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-white text-primary hover:bg-gray-100"
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
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Find Training Partners</h3>
            <p className="text-muted-foreground">
              Connect with members and instructors in your area based on skill level and location.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rate & Review</h3>
            <p className="text-muted-foreground">
              Share your experiences and help others find the best training opportunities.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Local Focus</h3>
            <p className="text-muted-foreground">
              Specifically designed for the Longwood, Orlando, and surrounding Central Florida area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
