import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProfileSchema, 
  insertRatingSchema,
  insertInstructorNoteSchema,
  insertJournalEntrySchema,
  insertTrainingMediaSchema
} from "@shared/schema";
import { z } from "zod";
import { seedMMAMembers } from "./seedMembers";
import { 
  generateTrainingPartnerRecommendations, 
  generatePersonalizedTrainingPlan,
  type RecommendationCriteria 
} from "./aiRecommendations";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertProfileSchema.parse({
        ...req.body,
        userId,
      });
      
      const profile = await storage.createProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: "Failed to create profile" });
    }
  });

  app.put('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertProfileSchema.partial().parse(req.body);
      
      const profile = await storage.updateProfile(userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/profiles/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfileByUserId(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // User routes (public for basic listings)
  app.get('/api/users', async (req: any, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        location: req.query.location as string,
        role: req.query.role as string,
        skillLevel: req.query.skillLevel as string,
      };
      
      // Clean up filters - remove empty strings and undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value && value !== 'all')
      );
      
      console.log('Applied filters:', cleanFilters);
      
      const users = await storage.getUsersWithProfiles(cleanFilters);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Rating routes (public stats first)
  app.get('/api/ratings/stats', async (req: any, res) => {
    try {
      const stats = await storage.getRatingStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching rating stats:", error);
      res.status(500).json({ message: "Failed to fetch rating stats" });
    }
  });

  app.get('/api/ratings/top-rated', async (req: any, res) => {
    try {
      const topUsers = await storage.getTopRatedUsers();
      res.json(topUsers);
    } catch (error) {
      console.error("Error fetching top rated users:", error);
      res.status(500).json({ message: "Failed to fetch top rated users" });
    }
  });

  app.post('/api/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user.claims.sub;
      const ratingData = insertRatingSchema.parse({
        ...req.body,
        fromUserId,
      });
      
      // Check if user is trying to rate themselves
      if (ratingData.fromUserId === ratingData.toUserId) {
        return res.status(400).json({ message: "Cannot rate yourself" });
      }
      
      // Check if rating already exists
      const existingRating = await storage.getUserRating(ratingData.fromUserId, ratingData.toUserId);
      if (existingRating) {
        return res.status(400).json({ message: "Rating already exists" });
      }
      
      const rating = await storage.createRating(ratingData);
      res.json(rating);
    } catch (error) {
      console.error("Error creating rating:", error);
      res.status(400).json({ message: "Failed to create rating" });
    }
  });

  app.get('/api/ratings/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      const ratings = await storage.getRatingsForUser(userId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Contact form endpoint
  app.post('/api/contact', isAuthenticated, async (req: any, res) => {
    try {
      const { name, email, subject, message, toUserId } = req.body;
      
      // In a real implementation, this would send an email
      // For now, we'll just return success
      console.log('Contact form submission:', { name, email, subject, message, toUserId });
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Instructor Notes routes
  app.post('/api/instructor-notes', isAuthenticated, async (req: any, res) => {
    try {
      const instructorId = req.user.claims.sub;
      const noteData = insertInstructorNoteSchema.parse({
        ...req.body,
        instructorId,
      });
      
      const note = await storage.createInstructorNote(noteData);
      res.json(note);
    } catch (error) {
      console.error("Error creating instructor note:", error);
      res.status(400).json({ message: "Failed to create instructor note" });
    }
  });

  app.get('/api/instructor-notes/:memberId', isAuthenticated, async (req: any, res) => {
    try {
      const { memberId } = req.params;
      const currentUserId = req.user.claims.sub;
      
      // Only allow instructors to view their own notes or members to view notes about them
      const notes = await storage.getInstructorNotes(memberId, currentUserId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching instructor notes:", error);
      res.status(500).json({ message: "Failed to fetch instructor notes" });
    }
  });

  // Journal Entry routes
  app.post('/api/journal-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertJournalEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createJournalEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(400).json({ message: "Failed to create journal entry" });
    }
  });

  app.get('/api/journal-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.put('/api/journal-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const updates = insertJournalEntrySchema.partial().parse(req.body);
      
      const entry = await storage.updateJournalEntry(entryId, updates);
      res.json(entry);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      res.status(400).json({ message: "Failed to update journal entry" });
    }
  });

  app.delete('/api/journal-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.deleteJournalEntry(entryId, userId);
      res.json({ message: "Journal entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Training Media routes
  app.post('/api/training-media', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const mediaData = insertTrainingMediaSchema.parse({
        ...req.body,
        userId,
      });
      
      const media = await storage.createTrainingMedia(mediaData);
      res.json(media);
    } catch (error) {
      console.error("Error creating training media:", error);
      res.status(400).json({ message: "Failed to create training media" });
    }
  });

  app.get('/api/training-media', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const includePublic = req.query.includePublic === 'true';
      
      const media = await storage.getTrainingMedia(userId, includePublic);
      res.json(media);
    } catch (error) {
      console.error("Error fetching training media:", error);
      res.status(500).json({ message: "Failed to fetch training media" });
    }
  });

  app.get('/api/training-media/public', isAuthenticated, async (req: any, res) => {
    try {
      const media = await storage.getPublicTrainingMedia();
      res.json(media);
    } catch (error) {
      console.error("Error fetching public training media:", error);
      res.status(500).json({ message: "Failed to fetch public training media" });
    }
  });

  // Contact/Messaging routes
  app.post('/api/contact', isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user.claims.sub;
      const { name, email, subject, message, toUserId } = req.body;
      
      // Basic validation
      if (!subject || !message || !toUserId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // For now, we'll just log the message (in a real app, you'd save to database or send email)
      console.log(`Contact message from ${fromUserId} to ${toUserId}:`, {
        name,
        email,
        subject,
        message
      });

      // Simulate successful message sending
      res.json({ 
        success: true, 
        message: "Message sent successfully" 
      });
    } catch (error) {
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Following routes for business networking
  app.post('/api/follow/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.userId;
      
      if (followerId === followingId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      // For now, just return success (would implement database logic here)
      res.json({ success: true, message: "Now following user" });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.delete('/api/follow/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.userId;
      
      // For now, just return success (would implement database logic here)
      res.json({ success: true, message: "Unfollowed user" });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  // AI-Powered Training Partner Recommendations
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUserWithProfile(userId);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Get all available users for recommendations
      const allUsers = await storage.getUsersWithProfiles();
      
      const criteria: RecommendationCriteria = {
        currentUser,
        availablePartners: allUsers,
        maxRecommendations: parseInt(req.query.limit as string) || 5
      };

      const recommendations = await generateTrainingPartnerRecommendations(criteria);
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // Personalized Training Plan Generator
  app.post('/api/training-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { partnerId } = req.body;
      
      const currentUser = await storage.getUserWithProfile(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User profile not found" });
      }

      let partner;
      if (partnerId) {
        partner = await storage.getUserWithProfile(partnerId);
      }

      const trainingPlan = await generatePersonalizedTrainingPlan(currentUser, partner);
      
      res.json(trainingPlan);
    } catch (error) {
      console.error("Error generating training plan:", error);
      res.status(500).json({ message: "Failed to generate training plan" });
    }
  });

  // Message routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const fromUserId = req.user.claims.sub;
      const messageData = {
        ...req.body,
        fromUserId,
      };
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const otherUserId = req.query.with as string;
      
      const messages = await storage.getMessages(userId, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Training Session routes
  app.post('/api/training-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const organizerId = req.user.claims.sub;
      const sessionData = {
        ...req.body,
        organizerId,
        sessionDate: new Date(req.body.sessionDate),
      };
      
      const session = await storage.createTrainingSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating training session:", error);
      res.status(400).json({ message: "Failed to create training session" });
    }
  });

  app.get('/api/training-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      res.status(500).json({ message: "Failed to fetch training sessions" });
    }
  });

  app.patch('/api/training-sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      
      if (updates.sessionDate) {
        updates.sessionDate = new Date(updates.sessionDate);
      }
      
      const session = await storage.updateTrainingSession(sessionId, updates);
      res.json(session);
    } catch (error) {
      console.error("Error updating training session:", error);
      res.status(400).json({ message: "Failed to update training session" });
    }
  });

  // Seed MMA members endpoint (for development)
  app.post('/api/seed-members', async (req, res) => {
    try {
      await seedMMAMembers();
      res.json({ success: true, message: "MMA members seeded successfully" });
    } catch (error) {
      console.error("Error seeding members:", error);
      res.status(500).json({ message: "Failed to seed members" });
    }
  });

  // Create test training session (for development)
  app.post('/api/create-test-session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Create a test session for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0); // 2 PM tomorrow
      
      const sessionData = {
        organizerId: userId,
        partnerId: "amanda-nunes", // Use one of our seeded fighters
        gymName: "Orlando BJJ Academy",
        gymAddress: "123 Training St, Orlando, FL 32801",
        sessionDate: tomorrow,
        duration: 90,
        trainingType: "sparring",
        notes: "Test session for debugging date display",
        status: "confirmed"
      };
      
      const session = await storage.createTrainingSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating test session:", error);
      res.status(400).json({ message: "Failed to create test session" });
    }
  });

  // Find gyms near location
  app.get('/api/gyms/search', async (req, res) => {
    try {
      const { lat, lng, address, radius = 10 } = req.query;
      
      let searchLat = parseFloat(lat as string);
      let searchLng = parseFloat(lng as string);
      const searchRadius = parseFloat(radius as string);
      
      // If address is provided, geocode it first
      if (address && !lat && !lng) {
        try {
          const geocodeResponse = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address as string)}&key=${process.env.OPENCAGE_API_KEY}`
          );
          const geocodeData = await geocodeResponse.json();
          
          if (geocodeData.results && geocodeData.results.length > 0) {
            searchLat = geocodeData.results[0].geometry.lat;
            searchLng = geocodeData.results[0].geometry.lng;
          } else {
            return res.status(400).json({ message: "Could not find location" });
          }
        } catch (geocodeError) {
          console.error("Geocoding error:", geocodeError);
          return res.status(500).json({ message: "Geocoding failed" });
        }
      }
      
      if (!searchLat || !searchLng) {
        return res.status(400).json({ message: "Location coordinates required" });
      }
      
      // Search for gyms using OpenStreetMap Overpass API
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["leisure"="fitness_centre"][name~"jiu.jitsu|bjj|mma|martial.arts|karate|taekwondo|kickboxing|muay.thai|boxing|wrestling",i](around:${searchRadius * 1609.34},${searchLat},${searchLng});
          node["leisure"="sports_centre"][name~"jiu.jitsu|bjj|mma|martial.arts|karate|taekwondo|kickboxing|muay.thai|boxing|wrestling",i](around:${searchRadius * 1609.34},${searchLat},${searchLng});
          node["sport"="martial_arts"](around:${searchRadius * 1609.34},${searchLat},${searchLng});
          way["leisure"="fitness_centre"][name~"jiu.jitsu|bjj|mma|martial.arts|karate|taekwondo|kickboxing|muay.thai|boxing|wrestling",i](around:${searchRadius * 1609.34},${searchLat},${searchLng});
          way["leisure"="sports_centre"][name~"jiu.jitsu|bjj|mma|martial.arts|karate|taekwondo|kickboxing|muay.thai|boxing|wrestling",i](around:${searchRadius * 1609.34},${searchLat},${searchLng});
          way["sport"="martial_arts"](around:${searchRadius * 1609.34},${searchLat},${searchLng});
        );
        out center;
      `;
      
      const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });
      
      if (!overpassResponse.ok) {
        throw new Error('Overpass API request failed');
      }
      
      const overpassData = await overpassResponse.json();
      
      // Process and format the gym data
      const gyms = overpassData.elements.map((element: any) => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        const distance = calculateDistance(searchLat, searchLng, lat, lon);
        
        return {
          id: element.id.toString(),
          name: element.tags?.name || "Martial Arts Gym",
          address: formatAddress(element.tags),
          phone: element.tags?.phone || "",
          website: element.tags?.website || element.tags?.["contact:website"] || "",
          rating: 4.0 + Math.random() * 1.0, // Placeholder rating
          distance: `${distance.toFixed(1)} miles`,
          hours: element.tags?.opening_hours || "Hours vary",
          specialties: extractSpecialties(element.tags?.name || "", element.tags?.sport || ""),
          description: generateDescription(element.tags),
          priceRange: "$$",
          lat,
          lng: lon,
        };
      }).filter((gym: any) => gym.lat && gym.lng);
      
      // Sort by distance
      gyms.sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));
      
      res.json(gyms);
    } catch (error) {
      console.error("Error searching gyms:", error);
      res.status(500).json({ message: "Failed to search gyms" });
    }
  });

  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function formatAddress(tags: any): string {
    const parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:state']) parts.push(tags['addr:state']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    
    return parts.length > 0 ? parts.join(' ') : "Address not available";
  }

  function extractSpecialties(name: string, sport: string): string[] {
    const specialties = [];
    const lowerName = name.toLowerCase();
    const lowerSport = sport.toLowerCase();
    
    if (lowerName.includes('jiu jitsu') || lowerName.includes('bjj') || lowerSport.includes('jiu_jitsu')) {
      specialties.push('Brazilian Jiu-Jitsu');
    }
    if (lowerName.includes('mma') || lowerName.includes('mixed martial arts')) {
      specialties.push('MMA');
    }
    if (lowerName.includes('muay thai') || lowerName.includes('thai boxing')) {
      specialties.push('Muay Thai');
    }
    if (lowerName.includes('boxing') && !lowerName.includes('kickboxing')) {
      specialties.push('Boxing');
    }
    if (lowerName.includes('kickboxing')) {
      specialties.push('Kickboxing');
    }
    if (lowerName.includes('karate')) {
      specialties.push('Karate');
    }
    if (lowerName.includes('taekwondo')) {
      specialties.push('Taekwondo');
    }
    if (lowerName.includes('wrestling')) {
      specialties.push('Wrestling');
    }
    
    return specialties.length > 0 ? specialties : ['Martial Arts'];
  }

  function generateDescription(tags: any): string {
    const name = tags?.name || "Martial Arts Gym";
    const sport = tags?.sport || "martial arts";
    
    return `${name} offers ${sport} training with experienced instructors in a welcoming environment.`;
  }

  const httpServer = createServer(app);
  return httpServer;
}
