import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-300 dark:text-slate-400 text-sm">
              © {new Date().getFullYear()} PrepperTrack. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <a 
              href="https://donate.stripe.com/7sYbJ1aPp9Nr0wy0i87N601" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-slate-300 dark:text-slate-400 hover:text-white transition-colors"
            >
              Support further development of PrepperTrack
            </a>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Project designed by <a href="https://indiefieldnotes.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 dark:text-slate-400 hover:text-white transition-colors">Indiefieldnotes.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}