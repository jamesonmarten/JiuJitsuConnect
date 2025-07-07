import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Globe, Star, Navigation, Clock, Users, Target, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
  lat?: number;
  lng?: number;
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string;
  isUsingGeolocation: boolean;
  locationError: string | null;
}

export default function GymFinder() {
  const { toast } = useToast();
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    address: "",
    isUsingGeolocation: false,
    locationError: null,
  });
  const [searchRadius, setSearchRadius] = useState("10");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get user's current location
  const presetLocations = [
    { name: "Orlando, FL", address: "Orlando, FL" },
    { name: "Tampa, FL", address: "Tampa, FL" },
    { name: "Jacksonville, FL", address: "Jacksonville, FL" },
    { name: "Miami, FL", address: "Miami, FL" },
    { name: "Milwaukee, WI", address: "Milwaukee, WI" },
    { name: "Madison, WI", address: "Madison, WI" },
    { name: "Green Bay, WI", address: "Green Bay, WI" },
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocation(prev => ({ ...prev, locationError: null }));

    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by this browser. Please select a city or enter an address.";
      setLocation(prev => ({ ...prev, locationError: error }));
      setIsGettingLocation(false);
      toast({
        title: "Location Access",
        description: "Please select a city from the dropdown or enter an address manually.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "",
          isUsingGeolocation: true,
          locationError: null,
        });
        setIsGettingLocation(false);
        toast({
          title: "Location Found",
          description: "Using your current location to find nearby gyms.",
        });
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enter an address manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please enter an address manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter an address manually.";
            break;
        }
        
        setLocation(prev => ({ ...prev, locationError: errorMessage }));
        setIsGettingLocation(false);
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Handle manual address input
  const handleAddressSearch = () => {
    if (!location.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a zip code or address to search.",
        variant: "destructive",
      });
      return;
    }

    setLocation(prev => ({
      ...prev,
      lat: null,
      lng: null,
      isUsingGeolocation: false,
      locationError: null,
    }));
  };

  // Auto-get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Query gyms based on location
  const { data: gyms = [], isLoading, error } = useQuery<Gym[]>({
    queryKey: ["/api/gyms/search", location.lat, location.lng, location.address, searchRadius],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (location.lat && location.lng) {
        params.append("lat", location.lat.toString());
        params.append("lng", location.lng.toString());
      } else if (location.address) {
        params.append("address", location.address);
      } else {
        throw new Error("No location specified");
      }
      
      params.append("radius", searchRadius);
      
      const response = await fetch(`/api/gyms/search?${params}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch gyms");
      }
      
      return response.json();
    },
    enabled: !!(location.lat && location.lng) || !!location.address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasLocation = (location.lat && location.lng) || location.address;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Find Gyms & Training Centers
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover martial arts gyms and training facilities near you
        </p>
      </div>

      {/* Location Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Location Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center gap-2"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  {isGettingLocation ? "Getting Location..." : "Use My Location"}
                </Button>
                
                {location.isUsingGeolocation && location.lat && location.lng && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Using GPS Location
                  </Badge>
                )}
              </div>
              
              {location.locationError && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {location.locationError}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    Try selecting a city from the dropdown below or entering your address manually.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Location Select:</label>
                <Select value="" onValueChange={(value) => {
                  const preset = presetLocations.find(p => p.address === value);
                  if (preset) {
                    setLocation(prev => ({ 
                      ...prev, 
                      address: preset.address,
                      lat: null,
                      lng: null,
                      isUsingGeolocation: false,
                      locationError: null
                    }));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city..." />
                  </SelectTrigger>
                  <SelectContent>
                    {presetLocations.map((loc) => (
                      <SelectItem key={loc.address} value={loc.address}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Or Enter Address:</label>
                <Input
                  placeholder="Zip code, city, or address..."
                  value={location.address}
                  onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddressSearch}
                  disabled={!location.address.trim()}
                  className="w-full flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search Gyms
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Search Radius:</label>
            <Select value={searchRadius} onValueChange={setSearchRadius}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="15">15 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {!hasLocation ? (
        <Card className="p-12 text-center">
          <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Set Your Location</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Allow location access or enter your address to find nearby gyms and training centers.
          </p>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-12 text-center">
          <div className="text-red-500 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Search Error</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to find gyms in your area. Please try a different location or check your internet connection.
          </p>
        </Card>
      ) : gyms.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Gyms Found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn't find any martial arts gyms in your search area. Try expanding your search radius or checking a different location.
          </p>
          <Button onClick={() => setSearchRadius("25")} variant="outline">
            Expand Search to 25 Miles
          </Button>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Found {gyms.length} gym{gyms.length !== 1 ? 's' : ''} within {searchRadius} miles
              {location.isUsingGeolocation ? " of your location" : location.address ? ` of ${location.address}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <Card key={gym.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{gym.name}</CardTitle>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{gym.rating.toFixed(1)}</span>
                      </div>
                      {(gym as any).status === 'contact_to_setup' && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Contact to Setup
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    {gym.address}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Navigation className="h-4 w-4" />
                    {gym.distance}
                  </div>
                  
                  {gym.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="h-4 w-4" />
                      {gym.phone}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    {gym.hours}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {gym.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {gym.description}
                  </p>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    {(gym as any).status === 'contact_to_setup' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(gym.website, "_blank")}
                          className="flex-1"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Visit Website
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const subject = encodeURIComponent(`MMA Connect Partnership - ${gym.name}`);
                            const body = encodeURIComponent(`Hi ${gym.name} team,\n\nI'm interested in setting up your gym on the MMA Connect platform to help connect with martial arts practitioners in our community.\n\nPlease contact us to discuss partnership opportunities.\n\nBest regards`);
                            window.open(`mailto:${gym.phone ? gym.phone : 'info@mmaconnect.com'}?subject=${subject}&body=${body}`, "_blank");
                          }}
                          className="flex-1"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Contact to Setup
                        </Button>
                      </>
                    ) : (
                      <>
                        {gym.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(gym.website, "_blank")}
                            className="flex-1"
                          >
                            <Globe className="h-4 w-4 mr-1" />
                            Website
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={() => {
                            const query = encodeURIComponent(gym.address);
                            window.open(`https://maps.google.com/maps?q=${query}`, "_blank");
                          }}
                          className="flex-1"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}