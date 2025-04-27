import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <Link href="/">
              <a className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <span className="text-2xl text-primary font-bold">RapMania</span>
                <i className="ri-mic-fill text-secondary"></i>
              </a>
            </Link>
            <p className="text-gray-400 max-w-md">
              The AI-powered rap lyric generator that helps you create fire verses in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><Link href="/discover"><a className="text-gray-400 hover:text-white transition">Discover</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Use</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} RapMania. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">Powered by:</p>
            <a href="https://vercel.com" className="text-gray-400 hover:text-white transition text-sm">Vercel</a>
            <a href="https://supabase.com" className="text-gray-400 hover:text-white transition text-sm">Supabase</a>
            <a href="https://anthropic.com" className="text-gray-400 hover:text-white transition text-sm">Claude</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
