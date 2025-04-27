import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GenerateRapForm } from '@shared/schema';

export interface RapBattle {
  id: number;
  userId: number;
  genreId: number;
  topic: string;
  stanzaCount: number;
  explicit: boolean;
  content: string;
  isPublic: boolean;
  createdAt: string;
}

export function useRap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const userId = user?.id;

  // Generate rap lyrics
  const { mutate: generateRap, isPending: isGenerating } = useMutation({
    mutationFn: async (formData: GenerateRapForm) => {
      console.log('Generating rap with data:', formData);
      const res = await apiRequest('POST', '/api/rap/generate', formData);
      const data = await res.json();
      console.log('Received response data:', data);
      return data.content as string;
    },
    onSuccess: (content) => {
      console.log('Setting generated content:', content);
      setGeneratedContent(content);
      // Show success toast
      toast({
        title: 'Rap Generated!',
        description: 'Your rap lyrics are ready to view',
      });
    },
    onError: (error: any) => {
      console.error('Error generating rap:', error);
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: error.message || 'Failed to generate rap lyrics',
      });
    },
  });

  // Save rap
  const { mutate: saveRap, isPending: isSaving } = useMutation({
    mutationFn: async (data: {
      genreId: number;
      topic: string;
      stanzaCount: number;
      explicit: boolean;
      content: string;
      isPublic: boolean;
    }) => {
      const res = await apiRequest('POST', '/api/rap', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rap/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rap/public'] });
      toast({
        title: 'Success!',
        description: 'Your rap has been saved',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: error.message || 'Failed to save rap',
      });
    },
  });

  // Get user's raps
  const {
    data: userRaps,
    isLoading: isLoadingUserRaps,
    error: userRapsError,
  } = useQuery({
    queryKey: ['/api/rap/user'],
    enabled: !!userId,
  });

  // Get public raps
  const {
    data: publicRaps,
    isLoading: isLoadingPublicRaps,
    error: publicRapsError,
  } = useQuery({
    queryKey: ['/api/rap/public'],
  });

  // Update rap
  const { mutate: updateRap } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<RapBattle> }) => {
      const res = await apiRequest('PUT', `/api/rap/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rap/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rap/public'] });
      toast({
        title: 'Updated!',
        description: 'Your rap has been updated',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message || 'Failed to update rap',
      });
    },
  });

  // Delete rap
  const { mutate: deleteRap } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/rap/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rap/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rap/public'] });
      toast({
        title: 'Deleted!',
        description: 'Your rap has been deleted',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error.message || 'Failed to delete rap',
      });
    },
  });

  // Like a rap
  const { mutate: likeRap } = useMutation({
    mutationFn: async (rapId: number) => {
      const res = await apiRequest('POST', `/api/rap/${rapId}/like`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rap/public'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to like rap',
      });
    },
  });

  // Unlike a rap
  const { mutate: unlikeRap } = useMutation({
    mutationFn: async (rapId: number) => {
      const res = await apiRequest('DELETE', `/api/rap/${rapId}/like`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rap/public'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to unlike rap',
      });
    },
  });

  return {
    // State
    generatedContent,
    setGeneratedContent,
    
    // Mutations
    generateRap,
    isGenerating,
    saveRap,
    isSaving,
    updateRap,
    deleteRap,
    likeRap,
    unlikeRap,
    
    // Queries
    userRaps,
    isLoadingUserRaps,
    userRapsError,
    publicRaps,
    isLoadingPublicRaps,
    publicRapsError,
  };
}
