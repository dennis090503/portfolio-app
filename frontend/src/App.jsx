import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

// Layout elements
import ScrollProgress from './components/ui/ScrollProgress';
import CursorGlow from './components/layout/CursorGlow';
import InteractiveBackground from './components/InteractiveBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Portfolio sections
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import TechStack from './components/sections/TechStack';
import Projects from './components/sections/Projects';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import AdminDashboard from './components/sections/AdminDashboard';

// Custom smoothness hook
import { useLenis } from './hooks/useLenis'; 

// Minimal Black and White Preloader Component
function Preloader({ onComplete }) {
  useEffect(() => {
    const counter = { val: 0 };
    const display = document.getElementById('loader-percentage');
    const bar = document.getElementById('loader-progress-bar');

    // Trigger precise numeric scaling sequence
    gsap.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (display) display.textContent = Math.round(counter.val) + "%";
        if (bar) bar.style.width = counter.val + "%";
      },
      onComplete: () => {
        // Run clean fade out animation before unmounting
        gsap.to(".preloader-wrapper", {
          opacity: 0,
          duration: 0.4,
          onComplete: onComplete
        });
      }
    });
  }, [onComplete]);

  return (
    <div className="preloader-wrapper fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#0A0A0A] text-[#FAFAF8]">
      <div className="w-64 space-y-4">
        
        {/* Dynamic Numerical Text Indicator */}
        <div className="flex justify-between items-end">
          <p className="font-display text-xs tracking-[0.25em] uppercase text-[#6B6B68]">
            Initializing
          </p>
          <span id="loader-percentage" className="font-display text-lg font-medium text-[#FAFAF8] tabular-nums">
            0%
          </span>
        </div>

        {/* Minimal Progress Track Wrapper */}
        <div className="h-[1px] w-full bg-white/10 rounded-full overflow-hidden">
          {/* Animated Monochrome Internal Progress Bar */}
          <div 
            id="loader-progress-bar" 
            className="h-full w-0 bg-[#FAFAF8] will-change-[width]"
          />
        </div>

      </div>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(true);

  // Call hook at the root level unconditionally to respect React lifecycle design rules
  useLenis();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative min-h-screen noise transition-colors duration-500 overflow-x-hidden selection:bg-primary/20 animate-fade-in">
      
      {/* Full-Screen GSAP Interactive Dot-Grid Background */}
      <InteractiveBackground />
      
      {/* Global Canvas Layouts & Floating Trackers */}
      <ScrollProgress />
      
      <CursorGlow />
      
      {currentPath === '/edit_details' ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboard />
        </div>
      ) : (
        <>
          <Navbar />
          
          <main className="relative z-10 flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24 pb-16">
            <Hero />
            <About />
            <Skills />
            <TechStack />
            <Experience />
            <Projects />
            <Achievements />
            <Contact />
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}