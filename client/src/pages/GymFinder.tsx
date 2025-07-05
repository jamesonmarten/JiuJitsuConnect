import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Globe, Star, Navigation, Clock, Users } from "lucide-react";

interface Gym {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  rating: number;
  distance: string;
  hours: string;
  specialties: string[];
  description: string;
  priceRange: string;
}

// Sample gym data for Orlando/Longwood area
const SAMPLE_GYMS: Gym[] = [
  {
    id: "1",
    name: "American Top Team Orlando",
    address: "3831 Vineland Rd, Orlando, FL 32811",
    phone: "(407) 237-2801",
    website: "https://attorlando.com",
    rating: 4.8,
    distance: "2.3 miles",
    hours: "Mon-Fri 6AM-9PM, Sat-Sun 8AM-6PM",
    specialties: ["Brazilian Jiu-Jitsu", "MMA", "Muay Thai", "Wrestling"],
    description: "Premier MMA training facility with world-class instructors and competitive teams.",
    priceRange: "$$$"
  },
  {
    id: "2",
    name: "Gracie Barra Orlando",
    address: "6000 Westwood Blvd, Orlando, FL 32821",
    phone: "(407) 233-8600",
    website: "https://graciebarra.com",
    rating: 4.7,
    distance: "3.1 miles",
    hours: "Mon-Fri 6AM-9PM, Sat 9AM-2PM",
    specialties: ["Brazilian Jiu-Jitsu", "Self-Defense", "Kids Classes"],
    description: "Traditional Brazilian Jiu-Jitsu school with strong fundamentals program.",
    priceRange: "$$"
  },
  {
    id: "3",
    name: "Orlando MMA Academy",
    address: "1425 Tuskawilla Rd, Winter Springs, FL 32708",
    phone: "(407) 695-5425",
    website: "https://orlandomma.com",
    rating: 4.6,
    distance: "5.2 miles",
    hours: "Mon-Sat 6AM-9PM, Sun 10AM-4PM",
    specialties: ["MMA", "BJJ", "Kickboxing", "Wrestling"],
    description: "Full-service MMA gym with cage training and professional coaching.",
    priceRange: "$$$"
  },
  {
    id: "4",
    name: "Longwood Martial Arts",
    address: "150 Wilshire Dr, Longwood, FL 32750",
    phone: "(407) 332-4800",
    rating: 4.4,
    distance: "1.8 miles",
    hours: "Mon-Fri 4PM-9PM, Sat 9AM-3PM",
    specialties: ["Brazilian Jiu-Jitsu", "Karate", "Kids Programs"],
    description: "Family-friendly martial arts school with beginner-friendly programs.",
    priceRange: "$"
  },
  {
    id: "5",
    name: "Elite Training Center",
    address: "2156 W State Rd 434, Longwood, FL 32779",
    phone: "(407) 774-5867",
    rating: 4.5,
    distance: "2.7 miles",
    hours: "Mon-Fri 5AM-10PM, Sat-Sun 7AM-8PM",
    specialties: ["CrossFit", "BJJ", "Boxing", "Personal Training"],
    description: "Multi-discipline training facility with strength and conditioning focus.",
    priceRange: "$$"
  }
];

export default function GymFinder() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [userLocation, setUserLocation] = useState("");

  const filteredGyms = SAMPLE_GYMS.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || 
                            gym.specialties.some(spec => spec.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    return matchesSearch && matchesSpecialty;
  });

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
  };

  const handleCallGym = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank');
  };

  // Easter egg: Special gym unlock
  const handleSecretGym = () => {
    toast({
      title: "🏛️ Secret Dojo Unlocked!",
      description: "You've discovered the legendary underground training facility. Respect!",
    });
    console.log("🥋 Secret dojo unlocked! The ancient art of debugging awaits...");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Find MMA Gyms Near You 🥊
        </h1>
        <p className="text-muted-foreground">
          Discover the best martial arts and MMA training facilities in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search gyms by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Specialties</option>
              <option value="brazilian jiu-jitsu">Brazilian Jiu-Jitsu</option>
              <option value="mma">MMA</option>
              <option value="muay thai">Muay Thai</option>
              <option value="boxing">Boxing</option>
              <option value="wrestling">Wrestling</option>
              <option value="kickboxing">Kickboxing</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Showing gyms near Longwood, Orlando, FL</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6">
        {filteredGyms.map((gym) => (
          <Card key={gym.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{gym.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{gym.rating}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{gym.distance}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{gym.priceRange}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Open
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Description */}
                <p className="text-muted-foreground">{gym.description}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {gym.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{gym.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{gym.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{gym.hours}</span>
                  </div>
                  {gym.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleVisitWebsite(gym.website!)}>
                        Visit Website
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handleGetDirections(gym.address)}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleCallGym(gym.phone)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  {gym.website && (
                    <Button 
                      variant="outline"
                      onClick={() => handleVisitWebsite(gym.website!)}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredGyms.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No gyms found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for new listings.
          </p>
        </div>
      )}

      {/* Easter Egg */}
      <div className="mt-12 text-center">
        <p className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
           onClick={handleSecretGym}>
          🥋 Psst... Click here to unlock the secret dojo
        </p>
      </div>
    </div>
  );
}