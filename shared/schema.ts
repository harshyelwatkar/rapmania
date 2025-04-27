import { pgTable, text, serial, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  avatarUrl: text("avatar_url"),
  googleId: text("google_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  avatarUrl: true,
  googleId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Genres table
export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenreSchema = createInsertSchema(genres).pick({
  name: true,
  icon: true,
});

export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type Genre = typeof genres.$inferSelect;

// Rap battles table
export const rapBattles = pgTable("rap_battles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  genreId: integer("genre_id").notNull().references(() => genres.id),
  topic: text("topic").notNull(),
  stanzaCount: integer("stanza_count").notNull(),
  explicit: boolean("explicit").default(false),
  content: text("content").notNull(),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations after all tables are declared

export const insertRapBattleSchema = createInsertSchema(rapBattles).pick({
  userId: true,
  genreId: true,
  topic: true,
  stanzaCount: true,
  explicit: true,
  content: true,
  isPublic: true,
});

export type InsertRapBattle = z.infer<typeof insertRapBattleSchema>;
export type RapBattle = typeof rapBattles.$inferSelect;

// Rap likes table
export const rapLikes = pgTable("rap_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rapId: integer("rap_id").notNull().references(() => rapBattles.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    // Ensure a user can only like a rap once
    uniqUserRap: unique().on(table.userId, table.rapId),
  };
});

// All relations will be defined at the end of the file

export const insertRapLikeSchema = createInsertSchema(rapLikes).pick({
  userId: true,
  rapId: true,
});

// Authentication schemas
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const generateRapSchema = z.object({
  genre: z.string().min(1, "Please select a genre"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  stanzaCount: z.number().min(4).max(16),
  explicit: z.boolean().default(false),
});

export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type GenerateRapForm = z.infer<typeof generateRapSchema>;

// Defining all relations after all tables are defined to avoid reference errors
export const usersRelations = relations(users, ({ many }) => ({
  rapBattles: many(rapBattles),
  rapLikes: many(rapLikes),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  rapBattles: many(rapBattles),
}));

export const rapBattlesRelations = relations(rapBattles, ({ one, many }) => ({
  user: one(users, {
    fields: [rapBattles.userId],
    references: [users.id],
  }),
  genre: one(genres, {
    fields: [rapBattles.genreId],
    references: [genres.id],
  }),
  likes: many(rapLikes),
}));

export const rapLikesRelations = relations(rapLikes, ({ one }) => ({
  user: one(users, {
    fields: [rapLikes.userId],
    references: [users.id],
  }),
  rap: one(rapBattles, {
    fields: [rapLikes.rapId],
    references: [rapBattles.id],
  }),
}));
