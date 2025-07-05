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
      
      const users = await storage.getUsersWithProfiles(filters);
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

  const httpServer = createServer(app);
  return httpServer;
}
