import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import MusicNotes from '@/components/MusicNotes';

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('sign-in');

  // Redirect to app if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/app');
    }
  }, [user, isLoading, navigate]);

  // Get the tab from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'sign-up') {
      setActiveTab('sign-up');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <MusicNotes />
      
      <div className="absolute top-6 left-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10"
        >
          <i className="ri-arrow-left-line mr-2"></i> Back to Home
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-900/50 backdrop-blur-md border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
              <span className="text-primary">RapMania</span>
              <i className="ri-mic-fill text-secondary"></i>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to start creating fire rap lyrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 bg-gray-800">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">
                <SignInForm />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
