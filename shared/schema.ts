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

// Training sessions for coordinating meetups
export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  partnerId: varchar("partner_id").notNull().references(() => users.id),
  gymName: varchar("gym_name").notNull(),
  gymAddress: varchar("gym_address").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  trainingType: varchar("training_type").notNull(), // 'sparring', 'drilling', 'rolling', 'technique'
  notes: text("notes"),
  status: varchar("status").default("pending"), // 'pending', 'confirmed', 'cancelled', 'completed'
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

// Gym licenses and business features
export const gymLicenses = pgTable("gym_licenses", {
  id: serial("id").primaryKey(),
  gymName: varchar("gym_name").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  gymAddress: text("gym_address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  website: varchar("website"),
  gymType: varchar("gym_type").notNull(), // "bjj", "mma", "muay_thai", "boxing", "kickboxing"
  licenseType: varchar("license_type").notNull().default("free"), // "free", "basic", "premium", "enterprise"
  maxMembers: integer("max_members").notNull().default(10), // Free: 10, Basic: 50, Premium: 200, Enterprise: unlimited
  currentMembers: integer("current_members").notNull().default(0),
  monthlyPrice: decimal("monthly_price").default("0.00"),
  yearlyPrice: decimal("yearly_price").default("0.00"),
  billingStatus: varchar("billing_status").default("active"), // "active", "suspended", "cancelled"
  trialEndDate: timestamp("trial_end_date"),
  ownerId: varchar("owner_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  leadsSinceLastBilling: integer("leads_since_last_billing").default(0),
  totalLeadsGenerated: integer("total_leads_generated").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead tracking for gyms
export const gymLeads = pgTable("gym_leads", {
  id: serial("id").primaryKey(),
  gymLicenseId: integer("gym_license_id").notNull().references(() => gymLicenses.id),
  prospectName: varchar("prospect_name").notNull(),
  prospectEmail: varchar("prospect_email").notNull(),
  prospectPhone: varchar("prospect_phone"),
  prospectMessage: text("prospect_message"),
  leadSource: varchar("lead_source").notNull(), // "gym_finder", "profile_view", "direct_contact"
  leadStatus: varchar("lead_status").default("new"), // "new", "contacted", "converted", "closed"
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"),
  estimatedValue: decimal("estimated_value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gym member connections (which users belong to which gym)
export const gymMembers = pgTable("gym_members", {
  id: serial("id").primaryKey(),
  gymLicenseId: integer("gym_license_id").notNull().references(() => gymLicenses.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  membershipType: varchar("membership_type").default("member"), // "member", "instructor", "admin"
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Group Messages table for group conversations
export const groupMessages = pgTable("group_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group Message Members table for tracking group participants
export const groupMessageMembers = pgTable("group_message_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupMessages.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: varchar("role").default("member"), // 'admin' or 'member'
});

// Group chat messages (extending existing messages table concept)
export const groupChatMessages = pgTable("group_chat_messages", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupMessages.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
});

// Calendar Events table for scheduling meetings
export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  groupId: integer("group_id").references(() => groupMessages.id),
  eventType: varchar("event_type").default("meeting"), // "meeting", "training", "competition", "social"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Calendar Event Participants table for tracking meeting attendees
export const calendarEventParticipants = pgTable("calendar_event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => calendarEvents.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").default("pending"), // 'pending', 'accepted', 'declined'
  invitedAt: timestamp("invited_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
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
  trainingSessionsOrganized: many(trainingSessions, { relationName: "trainingSessionsOrganized" }),
  trainingSessionsParticipated: many(trainingSessions, { relationName: "trainingSessionsParticipated" }),
  following: many(follows, { relationName: "following" }),
  followers: many(follows, { relationName: "followers" }),
  createdGroups: many(groupMessages),
  groupMemberships: many(groupMessageMembers),
  groupChatMessages: many(groupChatMessages),
  createdEvents: many(calendarEvents),
  eventParticipations: many(calendarEventParticipants),
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

export const trainingSessionsRelations = relations(trainingSessions, ({ one }) => ({
  organizer: one(users, {
    fields: [trainingSessions.organizerId],
    references: [users.id],
    relationName: "trainingSessionsOrganized",
  }),
  partner: one(users, {
    fields: [trainingSessions.partnerId],
    references: [users.id],
    relationName: "trainingSessionsParticipated",
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

// Group Messages relations
export const groupMessagesRelations = relations(groupMessages, ({ one, many }) => ({
  creator: one(users, {
    fields: [groupMessages.createdBy],
    references: [users.id],
  }),
  members: many(groupMessageMembers),
  messages: many(groupChatMessages),
  events: many(calendarEvents),
}));

export const groupMessageMembersRelations = relations(groupMessageMembers, ({ one }) => ({
  group: one(groupMessages, {
    fields: [groupMessageMembers.groupId],
    references: [groupMessages.id],
  }),
  user: one(users, {
    fields: [groupMessageMembers.userId],
    references: [users.id],
  }),
}));

export const groupChatMessagesRelations = relations(groupChatMessages, ({ one }) => ({
  group: one(groupMessages, {
    fields: [groupChatMessages.groupId],
    references: [groupMessages.id],
  }),
  sender: one(users, {
    fields: [groupChatMessages.senderId],
    references: [users.id],
  }),
}));

// Calendar Events relations
export const calendarEventsRelations = relations(calendarEvents, ({ one, many }) => ({
  creator: one(users, {
    fields: [calendarEvents.createdBy],
    references: [users.id],
  }),
  group: one(groupMessages, {
    fields: [calendarEvents.groupId],
    references: [groupMessages.id],
  }),
  participants: many(calendarEventParticipants),
}));

export const calendarEventParticipantsRelations = relations(calendarEventParticipants, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [calendarEventParticipants.eventId],
    references: [calendarEvents.id],
  }),
  user: one(users, {
    fields: [calendarEventParticipants.userId],
    references: [users.id],
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

export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  createdAt: true,
});

export const insertGymLicenseSchema = createInsertSchema(gymLicenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGymLeadSchema = createInsertSchema(gymLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGymMemberSchema = createInsertSchema(gymMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertGroupMessageMemberSchema = createInsertSchema(groupMessageMembers).omit({
  id: true,
  joinedAt: true,
});
export const insertGroupChatMessageSchema = createInsertSchema(groupChatMessages).omit({
  id: true,
  sentAt: true,
});
export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertCalendarEventParticipantSchema = createInsertSchema(calendarEventParticipants).omit({
  id: true,
  invitedAt: true,
  respondedAt: true,
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
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type GymLicense = typeof gymLicenses.$inferSelect;
export type InsertGymLicense = z.infer<typeof insertGymLicenseSchema>;
export type GymLead = typeof gymLeads.$inferSelect;
export type InsertGymLead = z.infer<typeof insertGymLeadSchema>;
export type GymMember = typeof gymMembers.$inferSelect;
export type InsertGymMember = z.infer<typeof insertGymMemberSchema>;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type GroupMessageMember = typeof groupMessageMembers.$inferSelect;
export type InsertGroupMessageMember = z.infer<typeof insertGroupMessageMemberSchema>;
export type GroupChatMessage = typeof groupChatMessages.$inferSelect;
export type InsertGroupChatMessage = z.infer<typeof insertGroupChatMessageSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEventParticipant = typeof calendarEventParticipants.$inferSelect;
export type InsertCalendarEventParticipant = z.infer<typeof insertCalendarEventParticipantSchema>;

// Combined user with profile type
export type UserWithProfile = User & {
  profile: Profile | null;
  averageRating?: number;
  ratingCount?: number;
};
