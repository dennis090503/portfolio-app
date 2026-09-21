import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import MagneticButton from '../ui/MagneticButton';
import ResumeModal from '../ui/ResumeModal';
import { profile } from '../../data/content';
import { useTheme } from '../../context/ThemeContext';
import profileFormal from '../../assets/dennis_image_1.png';
import profileCyber from '../../assets/dennis_image_2.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const imageRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`${API_BASE}/config`);
        if (res.ok) {
          const config = await res.json();
          const rawUrl = config?.identity?.resumeUrl || '/uploads/resume.pdf';
          const backendHost = API_BASE.replace('/api', '');
          const finalUrl = rawUrl.startsWith('http') ? rawUrl : `${backendHost}${rawUrl}`;
          setResumeUrl(finalUrl);
        }
      } catch (err) {
        console.warn('Hero fallback resume:', err);
      }
    };
    fetchResume();
  }, []);

  // Smooth torch tracking physics for image reveal
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22 });
  const [clipPos, setClipPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const unsubX = smoothX.on('change', (v) => setClipPos((p) => ({ ...p, x: v })));
    const unsubY = smoothY.on('change', (v) => setClipPos((p) => ({ ...p, y: v })));
    return () => {
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profile.roles.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    
    // Percentage positions for image masking reveal
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-28 bg-background transition-colors duration-500">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 -z-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#00F0FF]/[0.02] via-[#FF007A]/[0.01] to-transparent rounded-full blur-[120px] dark:block hidden pointer-events-none" />
      <div className="absolute bottom-12 right-0 -z-10 w-[600px] h-[600px] bg-gradient-to-br from-[#FFB800]/[0.02] via-[#00F0FF]/[0.02] to-transparent rounded-full blur-[140px] dark:block hidden pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-primary mb-4 break-words"
          >
            {profile.name}
          </motion.h1>

          <div className="h-12 overflow-hidden mb-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIndex}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl lg:text-2xl font-semibold tracking-wide text-gradient"
              >
                {profile.roles[roleIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-text-muted text-sm md:text-base max-w-md leading-relaxed mb-8 md:mb-10"
          >
            {profile.summary}
          </motion.p>

          <div className="flex flex-wrap items-center gap-5 md:gap-6">
            <MagneticButton 
              variant="primary" 
              onClick={() => setIsResumeOpen(true)}
              className="!text-white dark:!text-black dark:bg-[#00F0FF] dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              Resume
            </MagneticButton>
            
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-semibold underline underline-offset-4 decoration-current transition-colors text-text-muted hover:text-primary dark:hover:text-[#00F0FF]"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* Resume PDF Viewer Modal */}
        <ResumeModal 
          isOpen={isResumeOpen} 
          onClose={() => setIsResumeOpen(false)} 
          resumeUrl={resumeUrl} 
        />

        {/* Right Side: Interactive Image Container */}
        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="order-1 md:order-2 relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[450px] lg:max-w-[620px] xl:max-w-[780px] aspect-[4/5] mx-auto overflow-hidden select-none"
        >
          {/* Image Processing Sandbox */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Base Image Layer */}
            <img
              src={isDark ? profileCyber : profileFormal}
              alt={profile.name}
              className="absolute inset-0 w-full h-full object-contain transition-all duration-300 scale-[1.05]"
              style={{ objectPosition: 'center 50%' }}
            />

            {/* Reveal Overlay Layer - Reduced radius from 220px to 80px */}
            <img
              src={isDark ? profileFormal : profileCyber}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain scale-[1.05]"
              style={{
                objectPosition: 'center 50%',
                maskImage: isHovering
                  ? `radial-gradient(circle 80px at ${clipPos.x}% ${clipPos.y}%, black 35%, transparent 75%)`
                  : `radial-gradient(circle 0px at ${clipPos.x}% ${clipPos.y}%, black 0%, transparent 0%)`,
                WebkitMaskImage: isHovering
                  ? `radial-gradient(circle 80px at ${clipPos.x}% ${clipPos.y}%, black 35%, transparent 75%)`
                  : `radial-gradient(circle 0px at ${clipPos.x}% ${clipPos.y}%, black 0%, transparent 0%)`,
              }}
            />
          </div>
          {/* Layout Contrast Mask Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}