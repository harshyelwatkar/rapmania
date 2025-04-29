import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useRap } from '@/contexts/RapContext'; // Updated import path
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RapForm from '@/components/app/RapForm';
import RapResult from '@/components/app/RapResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import MusicNotes from '@/components/MusicNotes';

export default function AppPage() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { generatedContent, isGenerating } = useRap();
  const [step, setStep] = useState<'form' | 'result'>('form');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    setStep('form');
  }, [user?.id]);
  

  // Move to results step when content is generated
  useEffect(() => {
    if (generatedContent && generatedContent.trim().length > 0) {
      console.log('Generated content available, switching to result view');
      setStep('result');
    }
  }, [generatedContent]);
  
  // Debug logs for tracking state changes
  useEffect(() => {
    console.log('Current step:', step);
    console.log('Generated content length:', generatedContent?.length || 0);
  }, [step, generatedContent]);

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
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              Create Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">Rap Masterpiece</span>
            </h1>
            <p className="text-gray-300 mt-2">
              Fill in the details, and our AI will generate fire lyrics just for you
            </p>
          </motion.div>
          
          <Card className="bg-gray-900/50 backdrop-blur-md border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'form' ? 'bg-primary' : 'bg-gray-700'
                    }`}
                    animate={{ scale: step === 'form' ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white">1</span>
                  </motion.div>
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'result' ? 'bg-primary' : 'bg-gray-700'
                    }`}
                    animate={{ scale: step === 'result' ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white">2</span>
                  </motion.div>
                </div>
                
                {step === 'result' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('form')}
                    className="text-white"
                  >
                    <i className="ri-arrow-left-line mr-2"></i> Back to Form
                  </Button>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RapForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RapResult content={generatedContent} />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
