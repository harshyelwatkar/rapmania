import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MusicNote {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  color: string;
  symbol: string;
}

export default function MusicNotes() {
  const [notes, setNotes] = useState<MusicNote[]>([]);

  useEffect(() => {
    const noteSymbols = ['♩', '♪', '♫', '♬'];
    const colors = ['#6D28D9', '#F472B6', '#38BDF8'];
    const noteCount = 20;
    
    const generatedNotes: MusicNote[] = [];
    
    for (let i = 0; i < noteCount; i++) {
      generatedNotes.push({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 20 + 10}px`,
        duration: `${Math.random() * 10 + 10}s`,
        delay: `${Math.random() * 10}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
        symbol: noteSymbols[Math.floor(Math.random() * noteSymbols.length)]
      });
    }
    
    setNotes(generatedNotes);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          className="absolute opacity-20"
          initial={{ y: '100vh', rotate: 0, opacity: 0.4 }}
          animate={{ 
            y: '-100px', 
            rotate: 360, 
            opacity: 0,
            transition: {
              duration: parseFloat(note.duration),
              delay: parseFloat(note.delay),
              repeat: Infinity,
              ease: 'linear'
            }
          }}
          style={{
            left: note.left,
            fontSize: note.size,
            color: note.color,
          }}
        >
          {note.symbol}
        </motion.div>
      ))}
    </div>
  );
}
