import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateRapSchema, type GenerateRapForm } from '@shared/schema';
import { useRap } from '@/contexts/RapContext';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import GenreSelect from './GenreSelect';
import { motion } from 'framer-motion';

export default function RapForm() {
  const { generateRap, isGenerating } = useRap();
  const [charCount, setCharCount] = useState(0);
  
  const form = useForm<GenerateRapForm>({
    resolver: zodResolver(generateRapSchema),
    defaultValues: {
      genre: '',
      topic: '',
      stanzaCount: 8,
      explicit: false,
    },
  });

  const onSubmit = (data: GenerateRapForm) => {
    generateRap(data);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    form.setValue('topic', e.target.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Genre</FormLabel>
              <FormControl>
                <GenreSelect 
                  value={field.value} 
                  onChange={field.onChange} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What's your rap about? (money, love, dreams, struggles...)" 
                  className="bg-gray-900 border-gray-700 resize-none"
                  rows={3}
                  maxLength={150}
                  {...field}
                  onChange={handleTopicChange}
                />
              </FormControl>
              <div className="flex justify-end text-xs text-gray-400 mt-1">
                {charCount}/150
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="stanzaCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stanza Count: {field.value} lines</FormLabel>
                <FormControl>
                  <Slider
                    min={4}
                    max={16}
                    step={4}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormDescription className="text-gray-400 text-xs">
                  Select how many lines you want in your rap
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="explicit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Explicit Content</FormLabel>
                  <FormDescription className="text-gray-400 text-xs">
                    Allow explicit language in your rap
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-center pt-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              className="px-8 py-6 bg-gradient-to-r from-primary to-secondary text-white text-lg font-semibold rounded-lg flex items-center gap-2"
              size="lg"
              disabled={isGenerating}
            >
              <i className="ri-mic-fill"></i> 
              {isGenerating ? 'Generating...' : 'Drop the Mic'}
            </Button>
          </motion.div>
        </div>
      </form>
    </Form>
  );
}
