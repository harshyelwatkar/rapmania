import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: (googleData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest('POST', '/api/auth/signin', { email, password });
      const userData = await res.json();
      setUser(userData);
      navigate('/app');
      toast({
        title: 'Welcome back!',
        description: `Signed in as ${userData.username}`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: err.message || 'Invalid credentials',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest('POST', '/api/auth/signup', { username, email, password });
      const userData = await res.json();
      setUser(userData);
      navigate('/app');
      toast({
        title: 'Account created!',
        description: 'You are now signed in',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: err.message || 'Could not create account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (googleData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest('POST', '/api/auth/google', {
        email: googleData.email,
        name: googleData.name,
        googleId: googleData.sub,
      });
      const userData = await res.json();
      setUser(userData);
      navigate('/app');
      toast({
        title: 'Welcome!',
        description: `Signed in as ${userData.username}`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: err.message || 'Could not sign in with Google',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/signout', {});
      setUser(null);
      navigate('/');
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      isLoading,
      error, 
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }
  }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}