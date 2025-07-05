import {
  users,
  profiles,
  ratings,
  instructorNotes,
  journalEntries,
  trainingMedia,
  messages,
  trainingSessions,
  type User,
  type UpsertUser,
  type Profile,
  type InsertProfile,
  type Rating,
  type InsertRating,
  type UserWithProfile,
  type InstructorNote,
  type InsertInstructorNote,
  type JournalEntry,
  type InsertJournalEntry,
  type TrainingMedia,
  type InsertTrainingMedia,
  type Message,
  type InsertMessage,
  type TrainingSession,
  type InsertTrainingSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, avg, count, desc, gt } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  getUserWithProfile(id: string): Promise<UserWithProfile | undefined>;
  getUsersWithProfiles(filters?: {
    search?: string;
    location?: string;
    role?: string;
    skillLevel?: string;
  }): Promise<UserWithProfile[]>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  
  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsForUser(userId: string): Promise<Rating[]>;
  getUserRating(fromUserId: string, toUserId: string): Promise<Rating | undefined>;
  getTopRatedUsers(): Promise<UserWithProfile[]>;
  getRatingStats(): Promise<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }>;

  // Instructor Notes operations
  createInstructorNote(note: InsertInstructorNote): Promise<InstructorNote>;
  getInstructorNotes(memberId: string, instructorId?: string): Promise<InstructorNote[]>;
  updateInstructorNote(noteId: number, updates: Partial<InsertInstructorNote>): Promise<InstructorNote>;
  deleteInstructorNote(noteId: number, instructorId: string): Promise<void>;

  // Journal Entry operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  updateJournalEntry(entryId: number, updates: Partial<InsertJournalEntry>): Promise<JournalEntry>;
  deleteJournalEntry(entryId: number, userId: string): Promise<void>;

  // Training Media operations
  createTrainingMedia(media: InsertTrainingMedia): Promise<TrainingMedia>;
  getTrainingMedia(userId: string, includePublic?: boolean): Promise<TrainingMedia[]>;
  getPublicTrainingMedia(): Promise<TrainingMedia[]>;
  updateTrainingMedia(mediaId: number, updates: Partial<InsertTrainingMedia>): Promise<TrainingMedia>;
  deleteTrainingMedia(mediaId: number, userId: string): Promise<void>;

  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(userId: string, otherUserId?: string): Promise<Message[]>;
  getConversations(userId: string): Promise<{ user: UserWithProfile; lastMessage: Message; unreadCount: number }[]>;
  markMessageAsRead(messageId: number, userId: string): Promise<void>;

  // Training Session operations
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  getTrainingSessions(userId: string): Promise<TrainingSession[]>;
  updateTrainingSession(sessionId: number, updates: Partial<InsertTrainingSession>): Promise<TrainingSession>;
  deleteTrainingSession(sessionId: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserWithProfile(id: string): Promise<UserWithProfile | undefined> {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profile: profiles,
        averageRating: avg(ratings.rating),
        ratingCount: count(ratings.id),
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .leftJoin(ratings, eq(users.id, ratings.toUserId))
      .where(eq(users.id, id))
      .groupBy(users.id, profiles.id)
      .limit(1);

    if (result.length === 0) return undefined;

    const user = result[0];
    return {
      ...user,
      profile: user.profile,
      averageRating: user.averageRating ? Number(user.averageRating) : undefined,
      ratingCount: user.ratingCount || 0,
    };
  }

  async getUsersWithProfiles(filters?: {
    search?: string;
    location?: string;
    role?: string;
    skillLevel?: string;
  }): Promise<UserWithProfile[]> {
    const conditions = [eq(profiles.isActive, true)];

    if (filters?.search) {
      conditions.push(
        or(
          ilike(users.firstName, `%${filters.search}%`),
          ilike(users.lastName, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.location && filters.location !== "all") {
      conditions.push(ilike(profiles.location, `%${filters.location}%`));
    }

    if (filters?.role && filters.role !== "all") {
      conditions.push(eq(profiles.role, filters.role));
    }

    if (filters?.skillLevel && filters.skillLevel !== "all") {
      conditions.push(eq(profiles.skillLevel, filters.skillLevel));
    }

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profile: profiles,
        averageRating: avg(ratings.rating),
        ratingCount: count(ratings.id),
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .leftJoin(ratings, eq(users.id, ratings.toUserId))
      .where(and(...conditions))
      .groupBy(users.id, profiles.id)
      .orderBy(desc(avg(ratings.rating)));

    return result.map(user => ({
      ...user,
      profile: user.profile,
      averageRating: user.averageRating ? Number(user.averageRating) : undefined,
      ratingCount: user.ratingCount || 0,
    }));
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateProfile(userId: string, profileData: Partial<InsertProfile>): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const [newRating] = await db
      .insert(ratings)
      .values(rating)
      .returning();
    return newRating;
  }

  async getRatingsForUser(userId: string): Promise<Rating[]> {
    const result = await db
      .select({
        id: ratings.id,
        fromUserId: ratings.fromUserId,
        toUserId: ratings.toUserId,
        rating: ratings.rating,
        review: ratings.review,
        createdAt: ratings.createdAt,
        fromUser: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(ratings)
      .leftJoin(users, eq(ratings.fromUserId, users.id))
      .where(eq(ratings.toUserId, userId))
      .orderBy(desc(ratings.createdAt));

    return result.map(r => ({
      ...r,
      fromUser: r.fromUser,
    })) as any;
  }

  async getUserRating(fromUserId: string, toUserId: string): Promise<Rating | undefined> {
    const [rating] = await db
      .select()
      .from(ratings)
      .where(and(
        eq(ratings.fromUserId, fromUserId),
        eq(ratings.toUserId, toUserId)
      ));
    return rating;
  }

  async getTopRatedUsers(): Promise<UserWithProfile[]> {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profile: profiles,
        averageRating: avg(ratings.rating),
        ratingCount: count(ratings.id),
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .leftJoin(ratings, eq(users.id, ratings.toUserId))
      .where(eq(profiles.isActive, true))
      .groupBy(users.id, profiles.id)
      .having(gt(count(ratings.id), 0))
      .orderBy(desc(avg(ratings.rating)))
      .limit(10);

    return result.map(user => ({
      ...user,
      profile: user.profile,
      averageRating: user.averageRating ? Number(user.averageRating) : undefined,
      ratingCount: user.ratingCount || 0,
    }));
  }

  async getRatingStats(): Promise<{
    averageRating: number;
    totalReviews: number;
    activeMembers: number;
  }> {
    const [avgRating] = await db
      .select({ avg: avg(ratings.rating) })
      .from(ratings);

    const [totalReviews] = await db
      .select({ count: count(ratings.id) })
      .from(ratings);

    const [activeMembers] = await db
      .select({ count: count(profiles.id) })
      .from(profiles)
      .where(eq(profiles.isActive, true));

    return {
      averageRating: avgRating.avg ? Number(avgRating.avg) : 0,
      totalReviews: totalReviews.count || 0,
      activeMembers: activeMembers.count || 0,
    };
  }

  // Instructor Notes operations
  async createInstructorNote(note: InsertInstructorNote): Promise<InstructorNote> {
    const [newNote] = await db
      .insert(instructorNotes)
      .values(note)
      .returning();
    return newNote;
  }

  async getInstructorNotes(memberId: string, instructorId?: string): Promise<InstructorNote[]> {
    const conditions = [eq(instructorNotes.memberId, memberId)];
    
    if (instructorId) {
      conditions.push(eq(instructorNotes.instructorId, instructorId));
    }

    return await db
      .select()
      .from(instructorNotes)
      .where(and(...conditions))
      .orderBy(desc(instructorNotes.createdAt));
  }

  async updateInstructorNote(noteId: number, updates: Partial<InsertInstructorNote>): Promise<InstructorNote> {
    const [updatedNote] = await db
      .update(instructorNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(instructorNotes.id, noteId))
      .returning();
    return updatedNote;
  }

  async deleteInstructorNote(noteId: number, instructorId: string): Promise<void> {
    await db
      .delete(instructorNotes)
      .where(and(
        eq(instructorNotes.id, noteId),
        eq(instructorNotes.instructorId, instructorId)
      ));
  }

  // Journal Entry operations
  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [newEntry] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async updateJournalEntry(entryId: number, updates: Partial<InsertJournalEntry>): Promise<JournalEntry> {
    const [updatedEntry] = await db
      .update(journalEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(journalEntries.id, entryId))
      .returning();
    return updatedEntry;
  }

  async deleteJournalEntry(entryId: number, userId: string): Promise<void> {
    await db
      .delete(journalEntries)
      .where(and(
        eq(journalEntries.id, entryId),
        eq(journalEntries.userId, userId)
      ));
  }

  // Training Media operations
  async createTrainingMedia(media: InsertTrainingMedia): Promise<TrainingMedia> {
    const [newMedia] = await db
      .insert(trainingMedia)
      .values(media)
      .returning();
    return newMedia;
  }

  async getTrainingMedia(userId: string, includePublic: boolean = false): Promise<TrainingMedia[]> {
    if (includePublic) {
      return await db
        .select()
        .from(trainingMedia)
        .where(or(
          eq(trainingMedia.userId, userId),
          eq(trainingMedia.isPublic, true)
        ))
        .orderBy(desc(trainingMedia.createdAt));
    }

    return await db
      .select()
      .from(trainingMedia)
      .where(eq(trainingMedia.userId, userId))
      .orderBy(desc(trainingMedia.createdAt));
  }

  async getPublicTrainingMedia(): Promise<TrainingMedia[]> {
    return await db
      .select()
      .from(trainingMedia)
      .where(eq(trainingMedia.isPublic, true))
      .orderBy(desc(trainingMedia.createdAt));
  }

  async updateTrainingMedia(mediaId: number, updates: Partial<InsertTrainingMedia>): Promise<TrainingMedia> {
    const [updatedMedia] = await db
      .update(trainingMedia)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trainingMedia.id, mediaId))
      .returning();
    return updatedMedia;
  }

  async deleteTrainingMedia(mediaId: number, userId: string): Promise<void> {
    await db
      .delete(trainingMedia)
      .where(and(
        eq(trainingMedia.id, mediaId),
        eq(trainingMedia.userId, userId)
      ));
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getMessages(userId: string, otherUserId?: string): Promise<Message[]> {
    if (otherUserId) {
      // Get conversation between two specific users
      return await db
        .select()
        .from(messages)
        .where(or(
          and(eq(messages.fromUserId, userId), eq(messages.toUserId, otherUserId)),
          and(eq(messages.fromUserId, otherUserId), eq(messages.toUserId, userId))
        ))
        .orderBy(desc(messages.createdAt));
    }
    
    // Get all messages for user
    return await db
      .select()
      .from(messages)
      .where(or(
        eq(messages.fromUserId, userId),
        eq(messages.toUserId, userId)
      ))
      .orderBy(desc(messages.createdAt));
  }

  async getConversations(userId: string): Promise<{ user: UserWithProfile; lastMessage: Message; unreadCount: number }[]> {
    // This is a simplified implementation
    const userMessages = await this.getMessages(userId);
    const conversations: { [key: string]: { user: UserWithProfile; lastMessage: Message; unreadCount: number } } = {};
    
    for (const message of userMessages) {
      const otherUserId = message.fromUserId === userId ? message.toUserId : message.fromUserId;
      
      if (!conversations[otherUserId]) {
        const user = await this.getUserWithProfile(otherUserId);
        if (user) {
          conversations[otherUserId] = {
            user,
            lastMessage: message,
            unreadCount: 0
          };
        }
      }
      
      if (message.toUserId === userId && !message.isRead) {
        conversations[otherUserId].unreadCount++;
      }
    }
    
    return Object.values(conversations);
  }

  async markMessageAsRead(messageId: number, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(
        eq(messages.id, messageId),
        eq(messages.toUserId, userId)
      ));
  }

  // Training Session operations
  async createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession> {
    const [newSession] = await db
      .insert(trainingSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getTrainingSessions(userId: string): Promise<TrainingSession[]> {
    const sessions = await db
      .select({
        id: trainingSessions.id,
        organizerId: trainingSessions.organizerId,
        partnerId: trainingSessions.partnerId,
        gymName: trainingSessions.gymName,
        gymAddress: trainingSessions.gymAddress,
        sessionDate: trainingSessions.sessionDate,
        duration: trainingSessions.duration,
        trainingType: trainingSessions.trainingType,
        notes: trainingSessions.notes,
        status: trainingSessions.status,
        createdAt: trainingSessions.createdAt,
        updatedAt: trainingSessions.updatedAt,
        partnerName: users.firstName,
        partnerLastName: users.lastName,
      })
      .from(trainingSessions)
      .leftJoin(users, eq(users.id, trainingSessions.partnerId))
      .where(or(
        eq(trainingSessions.organizerId, userId),
        eq(trainingSessions.partnerId, userId)
      ))
      .orderBy(desc(trainingSessions.sessionDate));
    
    // Format the partner name
    return sessions.map(session => ({
      ...session,
      partnerName: `${session.partnerName} ${session.partnerLastName}`.trim(),
      partnerLastName: undefined, // Remove this field from the response
    }));
  }

  async updateTrainingSession(sessionId: number, updates: Partial<InsertTrainingSession>): Promise<TrainingSession> {
    const [updatedSession] = await db
      .update(trainingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trainingSessions.id, sessionId))
      .returning();
    return updatedSession;
  }

  async deleteTrainingSession(sessionId: number, userId: string): Promise<void> {
    await db
      .delete(trainingSessions)
      .where(and(
        eq(trainingSessions.id, sessionId),
        or(
          eq(trainingSessions.organizerId, userId),
          eq(trainingSessions.partnerId, userId)
        )
      ));
  }
}

export const storage = new DatabaseStorage();
