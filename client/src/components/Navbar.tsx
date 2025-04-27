import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [location] = useLocation();
  const { user, isLoading, signOut } = useAuth();

  // Animate the navbar when scrolling
  const [scrolled, setScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'bg-black/60' : 'bg-black/40'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <span className="text-2xl text-primary font-bold">RapMania</span>
            <i className="ri-mic-fill text-secondary"></i>
          </a>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {location === '/' && (
            <>
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
            </>
          )}
          <Link href="/discover">
            <a className="text-gray-300 hover:text-white transition">Discover</a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/app">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Create
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
                    <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link href="/auth">
                <a className="hidden sm:block px-4 py-2 rounded-lg text-white hover:bg-black/30 transition">
                  Login
                </a>
              </Link>
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary/90">
                  Try Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
