import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRap } from '@/contexts/RapContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { copyToClipboard, shareToTwitter, shareToWhatsApp } from '@/lib/utils';

interface RapResultProps {
  content: string;
}

export default function RapResult({ content }: RapResultProps) {
  const { user } = useAuth();
  const { saveRap, isSaving } = useRap();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isPublic, setIsPublic] = useState(true);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  
  // Break the content into words for animation
  useEffect(() => {
    if (!editMode) {
      const words = content.split(/\s+/);
      const timer = setInterval(() => {
        setDisplayedWords(prev => {
          if (prev.length < words.length) {
            return [...prev, words[prev.length]];
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [content, editMode]);
  
  // Get genres for saving
  const { data: genres } = useQuery<any[]>({
    queryKey: ['/api/genres'],
  });
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to save your rap',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Find hip-hop genre ID as default if available
      const genreId = genres?.find(g => g.name === 'Hip-Hop')?.id || 1;
      
      await saveRap({
        genreId,
        topic: 'My Rap', // This would be better if we had access to the original topic
        stanzaCount: editedContent.split('\n').filter(line => line.trim()).length,
        explicit: editedContent.includes('fuck') || editedContent.includes('shit'), // Simple check
        content: editedContent,
        isPublic,
      });
      
      toast({
        title: 'Saved!',
        description: 'Your rap has been saved to your profile',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save rap',
        variant: 'destructive',
      });
    }
  };
  
  const handleCopy = async () => {
    const success = await copyToClipboard(editedContent);
    if (success) {
      toast({
        title: 'Copied!',
        description: 'Lyrics copied to clipboard',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to copy lyrics',
        variant: 'destructive',
      });
    }
  };
  
  const handleShareTwitter = () => {
    shareToTwitter(editedContent.substring(0, 100) + '...', window.location.href);
  };
  
  const handleShareWhatsApp = () => {
    shareToWhatsApp(editedContent, window.location.href);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        {editMode ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="bg-gray-800 border-gray-700 min-h-[200px] font-mono text-gray-200"
          />
        ) : (
          <div className="font-mono text-gray-200 leading-relaxed whitespace-pre-line min-h-[200px]">
            {content.split('\n').map((line, lineIndex) => (
              <motion.div 
                key={lineIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: lineIndex * 0.1 }}
              >
                {line.split(/\s+/).map((word, wordIndex) => (
                  <motion.span
                    key={`${lineIndex}-${wordIndex}`}
                    className="inline-block mr-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (lineIndex * 10 + wordIndex) * 0.05 }}
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setEditMode(!editMode)}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <i className={`ri-${editMode ? 'check-line' : 'edit-line'} mr-1`}></i>
          {editMode ? 'Save Edits' : 'Edit'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <i className="ri-save-line mr-1"></i>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCopy}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <i className="ri-clipboard-line mr-1"></i>
          Copy
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleShareTwitter}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <i className="ri-twitter-x-line mr-1"></i>
          Twitter
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleShareWhatsApp}
          className="bg-gray-900 border-gray-700 hover:bg-gray-800"
        >
          <i className="ri-whatsapp-line mr-1"></i>
          WhatsApp
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Switch
            id="rap-privacy"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="rap-privacy" className="text-sm">
            {isPublic ? 'Public' : 'Private'}
          </Label>
        </div>
      </div>
    </div>
  );
}
