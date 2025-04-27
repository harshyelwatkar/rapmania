import { 
  users, type User, type InsertUser,
  genres, type Genre, type InsertGenre,
  rapBattles, type RapBattle, type InsertRapBattle,
  rapLikes
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or, desc, sql, count } from "drizzle-orm";

// Interface defining all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Genre operations
  getGenres(): Promise<Genre[]>;
  getGenre(id: number): Promise<Genre | undefined>;
  createGenre(genre: InsertGenre): Promise<Genre>;
  
  // Rap operations
  getRapBattle(id: number): Promise<RapBattle | undefined>;
  getRapBattlesByUser(userId: number): Promise<RapBattle[]>;
  getPublicRapBattles(): Promise<RapBattle[]>;
  searchRapBattles(query: string): Promise<RapBattle[]>;
  createRapBattle(rapBattle: InsertRapBattle): Promise<RapBattle>;
  updateRapBattle(id: number, rapBattle: Partial<RapBattle>): Promise<RapBattle | undefined>;
  deleteRapBattle(id: number): Promise<boolean>;
  
  // Rap likes operations
  likeRap(userId: number, rapId: number): Promise<any>;
  unlikeRap(userId: number, rapId: number): Promise<boolean>;
  getRapLikes(rapId: number): Promise<number>;
  getUserLikes(userId: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    if (!googleId) return undefined;
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Genre operations
  async getGenres(): Promise<Genre[]> {
    return db.select().from(genres);
  }

  async getGenre(id: number): Promise<Genre | undefined> {
    const [genre] = await db.select().from(genres).where(eq(genres.id, id));
    return genre;
  }

  async createGenre(insertGenre: InsertGenre): Promise<Genre> {
    const [genre] = await db.insert(genres).values(insertGenre).returning();
    return genre;
  }

  // Rap operations
  async getRapBattle(id: number): Promise<RapBattle | undefined> {
    const [rap] = await db.select().from(rapBattles).where(eq(rapBattles.id, id));
    return rap;
  }

  async getRapBattlesByUser(userId: number): Promise<RapBattle[]> {
    return db.select()
      .from(rapBattles)
      .where(eq(rapBattles.userId, userId))
      .orderBy(desc(rapBattles.createdAt));
  }

  async getPublicRapBattles(): Promise<RapBattle[]> {
    return db.select()
      .from(rapBattles)
      .where(eq(rapBattles.isPublic, true))
      .orderBy(desc(rapBattles.createdAt));
  }

  async searchRapBattles(query: string): Promise<RapBattle[]> {
    const searchPattern = `%${query}%`;
    return db.select()
      .from(rapBattles)
      .where(
        and(
          eq(rapBattles.isPublic, true),
          or(
            like(rapBattles.topic, searchPattern),
            like(rapBattles.content, searchPattern)
          )
        )
      )
      .orderBy(desc(rapBattles.createdAt));
  }

  async createRapBattle(insertRapBattle: InsertRapBattle): Promise<RapBattle> {
    const [rapBattle] = await db.insert(rapBattles).values(insertRapBattle).returning();
    return rapBattle;
  }

  async updateRapBattle(id: number, updates: Partial<RapBattle>): Promise<RapBattle | undefined> {
    const [updated] = await db
      .update(rapBattles)
      .set(updates)
      .where(eq(rapBattles.id, id))
      .returning();
    return updated;
  }

  async deleteRapBattle(id: number): Promise<boolean> {
    const result = await db.delete(rapBattles).where(eq(rapBattles.id, id));
    return result !== undefined;
  }

  // Rap likes operations
  async likeRap(userId: number, rapId: number): Promise<any> {
    try {
      // Try to insert the like
      const [rapLike] = await db
        .insert(rapLikes)
        .values({ userId, rapId })
        .returning();
      return rapLike;
    } catch (error) {
      // If there's a unique constraint violation, return the existing like
      const [existingLike] = await db
        .select()
        .from(rapLikes)
        .where(and(eq(rapLikes.userId, userId), eq(rapLikes.rapId, rapId)));
      
      if (existingLike) {
        return existingLike;
      }
      
      throw error;
    }
  }

  async unlikeRap(userId: number, rapId: number): Promise<boolean> {
    const result = await db
      .delete(rapLikes)
      .where(and(eq(rapLikes.userId, userId), eq(rapLikes.rapId, rapId)));
    return result !== undefined;
  }

  async getRapLikes(rapId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(rapLikes)
      .where(eq(rapLikes.rapId, rapId));
    return Number(result?.count || 0);
  }

  async getUserLikes(userId: number): Promise<any[]> {
    return db
      .select()
      .from(rapLikes)
      .where(eq(rapLikes.userId, userId));
  }

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    // Check if there are existing genres
    const existingGenres = await this.getGenres();
    
    if (existingGenres.length === 0) {
      console.log('Initializing default genres...');
      
      // Add default genres
      const defaultGenres: InsertGenre[] = [
        { name: "Hip-Hop", icon: "ri-album-line" },
        { name: "Drill", icon: "ri-disc-line" },
        { name: "Trap", icon: "ri-sound-module-line" },
        { name: "Old School", icon: "ri-record-circle-line" },
        { name: "R&B", icon: "ri-music-2-line" },
        { name: "Boom Bap", icon: "ri-rhythm-line" }
      ];
      
      for (const genre of defaultGenres) {
        await this.createGenre(genre);
      }
      
      console.log('Default genres created successfully');
    }
  }
}

// Initialize the storage and default data
export const storage = new DatabaseStorage();

// Initialize default data 
(async () => {
  try {
    await storage.initializeDefaultData();
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
})();