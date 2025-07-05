import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Profiles table for additional user information
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull(), // 'member' or 'instructor'
  skillLevel: varchar("skill_level").notNull(), // 'beginner', 'intermediate', 'advanced', 'expert'
  gymAffiliation: varchar("gym_affiliation"),
  location: varchar("location").notNull(), // 'longwood', 'orlando', 'winter-park', etc.
  beltRank: varchar("belt_rank"),
  experience: varchar("experience"),
  about: text("about"),
  bio: text("bio"), // Additional bio field for compatibility
  trainingGoals: text("training_goals"), // Training objectives
  availability: text("availability"), // Training availability
  phone: varchar("phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Instructor notes table - notes from instructors about members
export const instructorNotes = pgTable("instructor_notes", {
  id: serial("id").primaryKey(),
  instructorId: varchar("instructor_id").notNull().references(() => users.id),
  memberId: varchar("member_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  isPrivate: boolean("is_private").default(true), // Only visible to instructor and member
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Journal entries table - self-journal notes for members
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  mood: varchar("mood"), // e.g., "confident", "frustrated", "motivated"
  trainingType: varchar("training_type"), // e.g., "sparring", "drilling", "technique"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training media table - photos and videos from sessions
export const trainingMedia = pgTable("training_media", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title"),
  description: text("description"),
  mediaType: varchar("media_type").notNull(), // "photo" or "video"
  mediaUrl: varchar("media_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  sessionDate: timestamp("session_date"),
  trainingPartners: text("training_partners").array(), // Array of partner names
  techniques: text("techniques").array(), // Array of techniques practiced
  isPublic: boolean("is_public").default(false), // Whether visible to community
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table for direct communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  messageType: varchar("message_type").default("contact"), // 'contact', 'direct_message'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Following system for mutual connections (business networking)
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: varchar("follower_id").notNull().references(() => users.id),
  followingId: varchar("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  ratingsGiven: many(ratings, { relationName: "ratingsGiven" }),
  ratingsReceived: many(ratings, { relationName: "ratingsReceived" }),
  instructorNotesGiven: many(instructorNotes, { relationName: "instructorNotesGiven" }),
  instructorNotesReceived: many(instructorNotes, { relationName: "instructorNotesReceived" }),
  journalEntries: many(journalEntries),
  trainingMedia: many(trainingMedia),
  messagesSent: many(messages, { relationName: "messagesSent" }),
  messagesReceived: many(messages, { relationName: "messagesReceived" }),
  following: many(follows, { relationName: "following" }),
  followers: many(follows, { relationName: "followers" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  fromUser: one(users, {
    fields: [ratings.fromUserId],
    references: [users.id],
    relationName: "ratingsGiven",
  }),
  toUser: one(users, {
    fields: [ratings.toUserId],
    references: [users.id],
    relationName: "ratingsReceived",
  }),
}));

export const instructorNotesRelations = relations(instructorNotes, ({ one }) => ({
  instructor: one(users, {
    fields: [instructorNotes.instructorId],
    references: [users.id],
    relationName: "instructorNotesGiven",
  }),
  member: one(users, {
    fields: [instructorNotes.memberId],
    references: [users.id],
    relationName: "instructorNotesReceived",
  }),
}));

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
}));

export const trainingMediaRelations = relations(trainingMedia, ({ one }) => ({
  user: one(users, {
    fields: [trainingMedia.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  fromUser: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "messagesSent",
  }),
  toUser: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "messagesReceived",
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "following",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "followers",
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});
export const insertInstructorNoteSchema = createInsertSchema(instructorNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertTrainingMediaSchema = createInsertSchema(trainingMedia).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type InstructorNote = typeof instructorNotes.$inferSelect;
export type InsertInstructorNote = z.infer<typeof insertInstructorNoteSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type TrainingMedia = typeof trainingMedia.$inferSelect;
export type InsertTrainingMedia = z.infer<typeof insertTrainingMediaSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

// Combined user with profile type
export type UserWithProfile = User & {
  profile: Profile | null;
  averageRating?: number;
  ratingCount?: number;
};
