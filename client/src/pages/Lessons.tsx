import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Star, Users, BookOpen, Award, Target, Shield } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'BJJ' | 'MMA' | 'Muay Thai' | 'Boxing' | 'Wrestling';
  description: string;
  thumbnail: string;
  rating: number;
  views: number;
  isFree: boolean;
  tags: string[];
  videoUrl?: string;
}

const lessons: Lesson[] = [
  {
    id: "1",
    title: "Closed Guard Fundamentals",
    instructor: "Bernardo Faria",
    duration: "12:45",
    difficulty: "Beginner",
    category: "BJJ",
    description: "Learn the essential closed guard techniques from 5x World Champion Bernardo Faria. Master the foundations that every BJJ practitioner needs.",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    views: 15420,
    isFree: true,
    tags: ["Guard", "Fundamentals", "Closed Guard"],
    videoUrl: "https://www.youtube.com/embed/U7VoDcB1Go0"
  },
  {
    id: "2",
    title: "Sprawl Defense Technique",
    instructor: "Firas Zahabi",
    duration: "18:32",
    difficulty: "Intermediate",
    category: "MMA",
    description: "GSP's coach demonstrates proper sprawl technique for MMA takedown defense. Essential skills for any fighter.",
    thumbnail: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop&auto=format",
    rating: 4.8,
    views: 23150,
    isFree: true,
    tags: ["Takedown Defense", "Wrestling", "MMA"],
    videoUrl: "https://www.youtube.com/embed/WGqPO1jKpY8"
  },
  {
    id: "3",
    title: "Thai Clinch Control",
    instructor: "Sylvie von Duuglas-Ittu",
    duration: "15:20",
    difficulty: "Advanced",
    category: "Muay Thai",
    description: "Advanced clinch control techniques from one of the most experienced western Muay Thai fighters training in Thailand.",
    thumbnail: "https://images.unsplash.com/photo-1555597408-b57c073c3c2d?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    views: 18900,
    isFree: true,
    tags: ["Clinch", "Muay Thai", "Control"],
    videoUrl: "https://www.youtube.com/embed/dCiN7SOyzhU"
  },
  {
    id: "4",
    title: "Boxing Footwork Basics",
    instructor: "Precision Striking",
    duration: "14:15",
    difficulty: "Beginner",
    category: "Boxing",
    description: "Master fundamental boxing footwork patterns. Learn how to move efficiently and maintain balance while striking.",
    thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&auto=format",
    rating: 4.7,
    views: 31200,
    isFree: true,
    tags: ["Footwork", "Boxing", "Movement"],
    videoUrl: "https://www.youtube.com/embed/TQNNhEaQKD8"
  },
  {
    id: "5",
    title: "Armbar from Guard",
    instructor: "BJJ Fanatics",
    duration: "22:18",
    difficulty: "Advanced",
    category: "BJJ",
    description: "High-level armbar techniques from the guard position. Learn setups, grips, and finishing details.",
    thumbnail: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    views: 12800,
    isFree: true,
    tags: ["Submissions", "Armbar", "Guard"],
    videoUrl: "https://www.youtube.com/embed/pe_yqleGjQE"
  },
  {
    id: "6",
    title: "Double Leg Takedown",
    instructor: "FloWrestling",
    duration: "16:42",
    difficulty: "Intermediate",
    category: "Wrestling",
    description: "Perfect your double leg takedown technique with proper setup, penetration, and finish from top wrestling coaches.",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&auto=format",
    rating: 4.8,
    views: 19450,
    isFree: true,
    tags: ["Wrestling", "Takedowns", "Double Leg"],
    videoUrl: "https://www.youtube.com/embed/5nT4tjHhE3w"
  },
  {
    id: "7",
    title: "Jab Cross Combination",
    instructor: "ExpertBoxing",
    duration: "11:30",
    difficulty: "Beginner",
    category: "Boxing",
    description: "Learn the most fundamental boxing combination. Proper form, timing, and power generation for the 1-2 combo.",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0d83c7e6fad?w=600&h=400&fit=crop&auto=format",
    rating: 4.6,
    views: 42300,
    isFree: true,
    tags: ["Boxing", "Combinations", "Jab"],
    videoUrl: "https://www.youtube.com/embed/8qQ0W0Ajw4M"
  },
  {
    id: "8",
    title: "Triangle Choke Setup",
    instructor: "Invisible Jiu Jitsu",
    duration: "19:45",
    difficulty: "Intermediate",
    category: "BJJ",
    description: "Master the triangle choke from multiple positions. Learn the mechanics and troubleshooting for this essential submission.",
    thumbnail: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop&auto=format",
    rating: 4.8,
    views: 16750,
    isFree: true,
    tags: ["Triangle", "Submissions", "BJJ"],
    videoUrl: "https://www.youtube.com/embed/lsYgYA7CqxM"
  },
  {
    id: "9",
    title: "Muay Thai Kicks",
    instructor: "Muay Thai Scholar",
    duration: "17:22",
    difficulty: "Intermediate",
    category: "Muay Thai",
    description: "Develop powerful and technical kicks. Learn proper hip rotation, timing, and target selection for effective striking.",
    thumbnail: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&h=400&fit=crop&auto=format",
    rating: 4.7,
    views: 28900,
    isFree: true,
    tags: ["Kicks", "Muay Thai", "Technique"],
    videoUrl: "https://www.youtube.com/embed/Zt_Q4aqwW5M"
  },
  {
    id: "10",
    title: "Ground Control Basics",
    instructor: "John Danaher",
    duration: "24:15",
    difficulty: "Advanced",
    category: "BJJ",
    description: "Learn fundamental concepts of ground control from one of the most respected BJJ instructors in the world.",
    thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop&auto=format",
    rating: 4.9,
    views: 8900,
    isFree: true,
    tags: ["Control", "Fundamentals", "Strategy"],
    videoUrl: "https://www.youtube.com/embed/BWitv9AKoNU"
  }
];

export default function Lessons() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const filteredLessons = selectedCategory === "all" 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Elite Training Lessons
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Get exclusive access to premium training content from world-class instructors like Bernardo Faria, John Danaher, and Firas Zahabi. All lessons are completely free - no hidden fees, no subscriptions required.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Elite Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                <span>10+ Free Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Championship Level Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                src={selectedLesson.videoUrl}
                title={selectedLesson.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedLesson.title}</h3>
                  <p className="text-gray-600">by {selectedLesson.instructor}</p>
                </div>
                <Button 
                  onClick={() => setSelectedLesson(null)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
              <p className="text-gray-700 mb-4">{selectedLesson.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedLesson.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>All</TabsTrigger>
            <TabsTrigger value="BJJ" onClick={() => setSelectedCategory("BJJ")}>BJJ</TabsTrigger>
            <TabsTrigger value="MMA" onClick={() => setSelectedCategory("MMA")}>MMA</TabsTrigger>
            <TabsTrigger value="Muay Thai" onClick={() => setSelectedCategory("Muay Thai")}>Muay Thai</TabsTrigger>
            <TabsTrigger value="Boxing" onClick={() => setSelectedCategory("Boxing")}>Boxing</TabsTrigger>
            <TabsTrigger value="Wrestling" onClick={() => setSelectedCategory("Wrestling")}>Wrestling</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white">FREE</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {lesson.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{lesson.instructor}</span>
                        <Badge variant="outline">{lesson.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{lesson.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{lesson.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{lesson.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => setSelectedLesson(lesson)}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Instructor Highlights */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Learn from Legends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Bernardo Faria", specialty: "BJJ Legend", achievements: "5x World Champion" },
              { name: "Firas Zahabi", specialty: "MMA Coach", achievements: "GSP's Coach" },
              { name: "John Danaher", specialty: "BJJ Mastermind", achievements: "Elite Coach" },
              { name: "ExpertBoxing", specialty: "Boxing Channel", achievements: "1M+ Subscribers" }
            ].map((instructor, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{instructor.name}</CardTitle>
                  <CardDescription>
                    <div className="font-medium text-orange-600">{instructor.specialty}</div>
                    <div className="text-sm text-gray-600">{instructor.achievements}</div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Train with the Best?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join hundreds of fighters already learning from elite instructors
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Your Free Training Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}