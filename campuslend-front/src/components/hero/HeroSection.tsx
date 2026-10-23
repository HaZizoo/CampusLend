import React from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ value, onChange }) => {
  return (
    <div className="relative h-[600px] overflow-hidden bg-slate-900">
      {/* Background image from local file with pulse-slow animation for gentle motion */}
      <div className="absolute inset-0 bg-[url('/Erste.jpg')] bg-center bg-cover bg-no-repeat opacity-60 mix-blend-overlay animate-pulse-slow"></div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-slate-900/80 to-black/90 backdrop-blur-[2px]"></div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-8">

        {/* Animated Badge */}
        <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/90 text-sm font-medium mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
          </span>
          Trusted by 5,000+ HHU Students
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight text-white animate-slide-up [animation-delay:100ms] drop-shadow-xl">
          Share More. <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Spend Less.
          </span>
        </h1>

        <p className="text-xl sm:text-2xl mb-12 max-w-2xl text-blue-50/80 font-light animate-slide-up [animation-delay:200ms]">
          The premier peer-to-peer lending network for university equipment, textbooks, and more.
        </p>

        {/* Search Bar - Glassmorphism */}
        <div className="relative w-full max-w-2xl animate-slide-up [animation-delay:300ms]">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            placeholder="Search for laptops, lab coats, cameras..."
            value={value}
            onChange={onChange}
            aria-label="Search for items"
            className="w-full pl-14 pr-6 py-4.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:bg-white/20 focus-visible:border-white/40 transition-all duration-300 shadow-glass text-lg font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
