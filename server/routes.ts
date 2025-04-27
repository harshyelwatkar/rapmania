import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRapLyrics } from "./gemini";
import { 
  insertUserSchema, 
  signInSchema, 
  signUpSchema, 
  generateRapSchema,
  insertRapBattleSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      username: string;
      email: string;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStoreInstance = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "rapmania-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      },
      store: new MemoryStoreInstance({
        checkPeriod: 86400000 // 24 hours
      })
    })
  );

  // Set up passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        // If user logged in with Google, don't check password
        if (!user.password) {
          return done(null, false, { message: 'Please log in with Google' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialize and deserialize user for sessions
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };

  // Auth Routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const data = signUpSchema.parse(req.body);
      
      // Check if user already exists
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      const existingUsername = await storage.getUserByUsername(data.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        googleId: null
      });
      
      // Save user to session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  app.post('/api/auth/signin', (req, res, next) => {
    try {
      const data = signInSchema.parse(req.body);
      
      passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info?.message || 'Invalid credentials' });
        }
        
        // Save user to session
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email
        };
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error signing in' });
    }
  });

  app.post('/api/auth/google', async (req, res) => {
    try {
      const { email, name, googleId } = req.body;
      
      let user = await storage.getUserByGoogleId(googleId);
      
      // If no user with this Google ID, but email exists, update that user
      if (!user) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          // Update existing user with Google ID
          user = existingUser;
        } else {
          // Create new user
          user = await storage.createUser({
            username: name,
            email,
            password: null,
            googleId,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
          });
        }
      }
      
      // Save user to session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      
      // Return user
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error signing in with Google' });
    }
  });

  app.post('/api/auth/signout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error signing out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Signed out successfully' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.session.user);
  });

  // Genre Routes
  app.get('/api/genres', async (req, res) => {
    try {
      const genres = await storage.getGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching genres' });
    }
  });

  // Rap Generation and Management Routes
  app.post('/api/rap/generate', requireAuth, async (req, res) => {
    try {
      // Log the request
      console.log('Generating rap with data:', req.body);
      
      // Validate request data
      const data = generateRapSchema.parse(req.body);
      
      // Check if the API key is available
      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not found in environment variables');
        return res.status(500).json({ 
          message: 'API key missing. Contact administrator to set up GEMINI_API_KEY.' 
        });
      }
      
      try {
        // Generate rap lyrics
        const rapLyrics = await generateRapLyrics({
          topic: data.topic,
          genre: data.genre,
          stanzaCount: data.stanzaCount,
          explicit: data.explicit
        });
        
        // Log success
        console.log('Successfully generated rap lyrics');
        
        // Return the generated lyrics
        res.json({ content: rapLyrics });
      } catch (genError) {
        // Log the specific Gemini API error
        console.error('Gemini API error:', genError);
        return res.status(500).json({ 
          message: 'Error generating rap lyrics',
          details: genError instanceof Error ? genError.message : 'Unknown error'
        });
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error('Validation error:', validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      
      // Handle other errors
      console.error('Unexpected error in rap generation route:', error);
      res.status(500).json({ message: 'Error processing rap generation request' });
    }
  });

  app.post('/api/rap', requireAuth, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      
      const data = insertRapBattleSchema.parse({
        ...req.body,
        userId
      });
      
      const rapBattle = await storage.createRapBattle(data);
      res.status(201).json(rapBattle);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error saving rap battle' });
    }
  });

  app.get('/api/rap/user', requireAuth, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const raps = await storage.getRapBattlesByUser(userId);
      res.json(raps);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user raps' });
    }
  });

  app.get('/api/rap/public', async (req, res) => {
    try {
      const raps = await storage.getPublicRapBattles();
      res.json(raps);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching public raps' });
    }
  });

  app.get('/api/rap/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const raps = await storage.searchRapBattles(query);
      res.json(raps);
    } catch (error) {
      res.status(500).json({ message: 'Error searching raps' });
    }
  });

  app.get('/api/rap/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid rap ID' });
      }
      
      const rap = await storage.getRapBattle(id);
      if (!rap) {
        return res.status(404).json({ message: 'Rap not found' });
      }
      
      if (!rap.isPublic && (!req.session.user || req.session.user.id !== rap.userId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(rap);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching rap' });
    }
  });

  app.put('/api/rap/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid rap ID' });
      }
      
      const rap = await storage.getRapBattle(id);
      if (!rap) {
        return res.status(404).json({ message: 'Rap not found' });
      }
      
      if (req.session.user!.id !== rap.userId) {
        return res.status(403).json({ message: 'You can only update your own raps' });
      }
      
      const updatedRap = await storage.updateRapBattle(id, req.body);
      res.json(updatedRap);
    } catch (error) {
      res.status(500).json({ message: 'Error updating rap' });
    }
  });

  app.delete('/api/rap/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid rap ID' });
      }
      
      const rap = await storage.getRapBattle(id);
      if (!rap) {
        return res.status(404).json({ message: 'Rap not found' });
      }
      
      if (req.session.user!.id !== rap.userId) {
        return res.status(403).json({ message: 'You can only delete your own raps' });
      }
      
      await storage.deleteRapBattle(id);
      res.json({ message: 'Rap deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting rap' });
    }
  });

  // Likes Routes
  app.post('/api/rap/:id/like', requireAuth, async (req, res) => {
    try {
      const rapId = parseInt(req.params.id);
      const userId = req.session.user!.id;
      
      if (isNaN(rapId)) {
        return res.status(400).json({ message: 'Invalid rap ID' });
      }
      
      const rap = await storage.getRapBattle(rapId);
      if (!rap) {
        return res.status(404).json({ message: 'Rap not found' });
      }
      
      const like = await storage.likeRap(userId, rapId);
      const likeCount = await storage.getRapLikes(rapId);
      
      res.json({ like, count: likeCount });
    } catch (error) {
      res.status(500).json({ message: 'Error liking rap' });
    }
  });

  app.delete('/api/rap/:id/like', requireAuth, async (req, res) => {
    try {
      const rapId = parseInt(req.params.id);
      const userId = req.session.user!.id;
      
      if (isNaN(rapId)) {
        return res.status(400).json({ message: 'Invalid rap ID' });
      }
      
      await storage.unlikeRap(userId, rapId);
      const likeCount = await storage.getRapLikes(rapId);
      
      res.json({ count: likeCount });
    } catch (error) {
      res.status(500).json({ message: 'Error unliking rap' });
    }
  });

  app.get('/api/rap/:id/likes', async (req, res) => {
    try {
      const rapId = parseInt(req.params.id);
      
      if (isNaN(rapId)) {
        return res.status(400).json({ message: 'Invalid rap ID' });
      }
      
      const likeCount = await storage.getRapLikes(rapId);
      res.json({ count: likeCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching likes' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
