import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, generateAvatarUrl } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useRap } from '@/contexts/RapContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RapCardProps {
  rap: {
    id: number;
    userId: number;
    genreId: number;
    topic: string;
    content: string;
    createdAt: string;
    isPublic: boolean;
  };
}

export default function RapCard({ rap }: RapCardProps) {
  const { user } = useAuth();
  const { likeRap, unlikeRap } = useRap();
  const [liked, setLiked] = useState(false);
  const queryClient = useQueryClient();
  
  // Get genre name
  const { data: genres } = useQuery<any[]>({
    queryKey: ['/api/genres'],
  });
  
  const genreName = genres?.find(g => g.id === rap.genreId)?.name || 'Hip-Hop';
  
  // Get username of rap creator
  const { data: userData } = useQuery({
    queryKey: ['/api/users', rap.userId],
    enabled: !!rap.userId,
  });
  
  const username = (userData as { username: string })?.username || 'Anonymous';

  
  // Get likes count
  const { data: likesData, isLoading: likesLoading } = useQuery({
    queryKey: ['/api/rap', rap.id, 'likes'],
  });
  
  const likesCount = (likesData as { count: number })?.count || 0;
  
  // Handle like/unlike
  const handleLikeToggle = () => {
    if (!user) return;
    
    if (liked) {
      unlikeRap(rap.id);
      setLiked(false);
    } else {
      likeRap(rap.id);
      setLiked(true);
    }
  };
  
  // Determine badge type (new, trending, popular)
  const getBadge = () => {
    const now = new Date();
    const rapDate = new Date(rap.createdAt);
    const hoursSinceCreation = (now.getTime() - rapDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCreation < 24) {
      return { text: 'NEW', color: 'bg-accent text-accent-foreground' };
    }
    
    if (likesCount > 30) {
      return { text: 'TRENDING', color: 'bg-secondary text-secondary-foreground' };
    }
    
    if (likesCount > 15) {
      return { text: 'POPULAR', color: 'bg-primary text-primary-foreground' };
    }
    
    return null;
  };
  
  const badge = getBadge();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gray-900/40 backdrop-blur-sm overflow-hidden border-gray-800">
        <CardHeader className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={generateAvatarUrl(username)} alt={username} />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{username}</p>
                <p className="text-xs text-gray-400">{genreName}</p>
              </div>
            </div>
            {badge && (
              <Badge variant="outline" className={`${badge.color} text-xs px-2`}>
                {badge.text}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <p className="font-mono text-gray-200 leading-relaxed whitespace-pre-line line-clamp-6">
            {rap.content}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 border-t border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-1 text-gray-400 hover:text-secondary transition ${liked ? 'text-secondary' : ''}`}
                    disabled={!user}
                  >
                    <i className={`${liked ? 'ri-heart-fill' : 'ri-heart-line'}`}></i>{' '}
                    <span>{likesCount}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {user ? (liked ? 'Unlike' : 'Like') : 'Login to like'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-400 hover:text-accent transition"
                  >
                    <i className="ri-share-line"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Share
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <span className="text-xs text-gray-400">
            {formatDate(rap.createdAt)}
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
