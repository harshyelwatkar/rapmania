import React, { useState } from 'react';
import { useRap } from '@/contexts/RapContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';

export default function SavedRaps() {
  const { userRaps, isLoadingUserRaps, updateRap, deleteRap } = useRap();
  const { toast } = useToast();
  const [editingRapId, setEditingRapId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedIsPublic, setEditedIsPublic] = useState(true);
  
  const handleEditStart = (rap) => {
    setEditingRapId(rap.id);
    setEditedContent(rap.content);
    setEditedIsPublic(rap.isPublic);
  };
  
  const handleEditCancel = () => {
    setEditingRapId(null);
  };
  
  const handleEditSave = async (id: number) => {
    try {
      await updateRap({
        id,
        data: {
          content: editedContent,
          isPublic: editedIsPublic
        }
      });
      
      setEditingRapId(null);
      toast({
        title: 'Success',
        description: 'Rap updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rap',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteRap(id);
      toast({
        title: 'Success',
        description: 'Rap deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete rap',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingUserRaps) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-gray-900/40 border-gray-800">
            <CardHeader className="p-4 border-b border-gray-700">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!userRaps || userRaps.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4 text-gray-500">
          <i className="ri-music-2-line"></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">No saved raps yet</h3>
        <p className="text-gray-400 mb-4">
          Create your first rap to see it here
        </p>
        <Button 
          variant="default" 
          onClick={() => window.location.href = '/app'}
          className="bg-primary hover:bg-primary/90"
        >
          Create New Rap
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userRaps.map((rap, index) => (
        <motion.div
          key={rap.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-gray-900/40 border-gray-800">
            <CardHeader className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {rap.topic || 'Untitled Rap'}
                </h3>
                <div className="flex items-center gap-2">
                  {editingRapId === rap.id ? (
                    <>
                      <Switch
                        id={`rap-privacy-${rap.id}`}
                        checked={editedIsPublic}
                        onCheckedChange={setEditedIsPublic}
                      />
                      <Label htmlFor={`rap-privacy-${rap.id}`} className="text-sm">
                        {editedIsPublic ? 'Public' : 'Private'}
                      </Label>
                    </>
                  ) : (
                    <div className={`px-2 py-1 rounded-full text-xs ${rap.isPublic ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                      {rap.isPublic ? 'Public' : 'Private'}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-400">{formatDate(rap.createdAt)}</p>
            </CardHeader>
            
            <CardContent className="p-4">
              {editingRapId === rap.id ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="bg-gray-800 border-gray-700 min-h-[150px] font-mono text-gray-200"
                />
              ) : (
                <p className="font-mono text-gray-200 leading-relaxed whitespace-pre-line">
                  {rap.content}
                </p>
              )}
            </CardContent>
            
            <CardFooter className="p-4 border-t border-gray-700 flex justify-between">
              <div className="flex gap-2">
                {editingRapId === rap.id ? (
                  <>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleEditSave(rap.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <i className="ri-check-line mr-1"></i> Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleEditCancel}
                      className="bg-gray-800 border-gray-700"
                    >
                      <i className="ri-close-line mr-1"></i> Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditStart(rap)}
                      className="bg-gray-800 border-gray-700"
                    >
                      <i className="ri-edit-line mr-1"></i> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-gray-800 border-gray-700 text-red-400 hover:text-red-300"
                        >
                          <i className="ri-delete-bin-line mr-1"></i> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-900 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your rap.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-800 border-gray-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(rap.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-gray-300"
                  disabled={editingRapId === rap.id}
                >
                  <i className="ri-share-line mr-1"></i> Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
