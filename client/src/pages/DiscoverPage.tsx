import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRap } from '@/contexts/RapContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RapCard from '@/components/discover/RapCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import MusicNotes from '@/components/MusicNotes';

export default function DiscoverPage() {
  const { publicRaps, isLoadingPublicRaps } = useRap();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search functionality
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/rap/search', searchQuery],
    enabled: searchQuery.length > 2,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const displayRaps = searchQuery.length > 2 ? searchResults : publicRaps;
  const isLoading = searchQuery.length > 2 ? isSearching : isLoadingPublicRaps;

  return (
    <div className="min-h-screen bg-black text-white">
      <MusicNotes />
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">Discover</span> Community Raps
            </h1>
            <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
              Check out the latest and greatest raps created by the RapMania community
            </p>
          </motion.div>
          
          <div className="max-w-lg mx-auto mb-10">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by topic or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900/60 border-gray-700 focus:border-primary"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <i className="ri-search-line mr-2"></i> Search
              </Button>
            </form>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-900/40 rounded-xl overflow-hidden border border-gray-800 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayRaps?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRaps.map((rap, index) => (
                <motion.div
                  key={rap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <RapCard rap={rap} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 text-gray-500">
                <i className="ri-music-2-line"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">No raps found</h3>
              <p className="text-gray-400">
                {searchQuery.length > 0
                  ? "No raps match your search query. Try something different."
                  : "There are no public raps yet. Be the first to create and share one!"}
              </p>
              {searchQuery.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
