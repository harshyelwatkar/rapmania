import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useRap } from '@/contexts/RapContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SavedRaps from '@/components/profile/SavedRaps';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import MusicNotes from '@/components/MusicNotes';

export default function ProfilePage() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { userRaps, isLoadingUserRaps } = useRap();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <MusicNotes />
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-md border-gray-800 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                    <AvatarFallback className="text-2xl">
                      {user?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{user?.username}</h1>
                    <p className="text-gray-400">{user?.email}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/app')}>
                        <i className="ri-add-line"></i> Create New Rap
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={signOut}>
                        <i className="ri-logout-box-line"></i> Sign Out
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary">
                      {isLoadingUserRaps ? (
                        <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                      ) : (
                        userRaps?.length || 0
                      )}
                    </p>
                    <p className="text-sm text-gray-400">Saved Raps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="my-raps">
              <TabsList className="bg-gray-800 w-full mb-6">
                <TabsTrigger value="my-raps" className="flex-1">My Raps</TabsTrigger>
                <TabsTrigger value="liked" className="flex-1">Liked Raps</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-raps">
                <SavedRaps />
              </TabsContent>
              
              <TabsContent value="liked">
                <div className="text-center py-16">
                  <div className="text-5xl mb-4 text-gray-500">
                    <i className="ri-heart-line"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                  <p className="text-gray-400">
                    This feature is coming in a future update. Stay tuned!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
