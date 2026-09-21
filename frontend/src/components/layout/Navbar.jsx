import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; 
import MagneticButton from '../ui/MagneticButton';
import LightPullThemeSwitcher from '../ui/light-pull-theme-switcher';
import ResumeModal from '../ui/ResumeModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch active resume URL from site config or fallback
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
        console.warn('Using default fallback resume URL:', err);
      }
    };
    fetchResume();
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  // Dynamic text coloring
  const isDarkText = isDark || (!isDark && scrolled);

  // Dynamic scroll background styling per requirements:
  // Light Mode: scrolled -> bg-black, top -> bg-transparent
  // Dark Mode: scrolled -> bg-blue-600/90, top -> bg-transparent / bg-neutral-950/80
  const navBackgroundStyles = isDark
    ? scrolled
      ? 'bg-blue-600/90 border-blue-500/50 text-white shadow-[0_0_30px_rgba(37,99,235,0.35)]'
      : 'bg-transparent border-neutral-800/80 text-white dark:bg-neutral-950/80 shadow-[0_0_30px_rgba(0,240,255,0.12)]'
    : scrolled
    ? 'bg-black border-neutral-900 text-white shadow-2xl'
    : 'bg-transparent border-transparent text-neutral-900';

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 flex justify-center pointer-events-none"
      >
        <nav 
          className={`relative w-full max-w-6xl px-4 sm:px-6 py-2.5 flex items-center justify-between rounded-full border transition-all duration-500 pointer-events-auto backdrop-blur-md ${navBackgroundStyles}`}
        >
          {/* Brand Logo */}
          <a 
            href="#hero" 
            className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
              isDarkText ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Dennis<span className="text-accent">.</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                  isDarkText 
                    ? 'text-neutral-300 hover:text-white hover:bg-white/10' 
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Actions & End Boundary Theme Switcher */}
          <div className="hidden md:flex items-center gap-4 h-full">
            <MagneticButton 
              variant="outline" 
              className="!py-2 !px-6 font-bold !rounded-full !bg-white !text-blue-600 hover:!bg-blue-50 !border !border-blue-300 shadow-md transition-all duration-300" 
              style={{ backgroundColor: '#ffffff', color: '#2563eb' }}
              onClick={() => setIsResumeOpen(true)}
            >
              Resume
            </MagneticButton>

            {/* Interactive Pull String Switcher attached at end boundary of navbar */}
            <div className="pl-1 flex items-center h-full">
              <LightPullThemeSwitcher />
            </div>
          </div>

          {/* Mobile Actions Drawer Toggles */}
          <div className="flex md:hidden items-center gap-3 h-full">
            <LightPullThemeSwitcher />
            
            <button
              className={`focus:outline-none p-2 transition-colors ${isDarkText ? 'text-white' : 'text-neutral-900'}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setOpen(false)}
            className={`fixed inset-0 backdrop-blur-lg z-50 md:hidden flex flex-col justify-center px-6 transition-colors duration-300 ${
              isDark ? 'bg-neutral-950/95 text-white' : 'bg-neutral-900/95 text-white'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 p-3 text-white/80 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex flex-col gap-6 w-full max-w-sm mx-auto"
            >
              {LINKS.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleNav(link.href)}
                  className="text-left text-3xl font-bold transition-colors py-2 text-neutral-200 hover:text-white active:text-accent min-h-[44px] flex items-center"
                >
                  {link.label}
                </motion.button>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: LINKS.length * 0.05 }}
                className="pt-6 border-t border-white/15 mt-2"
              >
                <button
                  onClick={() => { setOpen(false); setIsResumeOpen(true); }}
                  className="w-full text-center py-3.5 rounded-full font-bold text-base shadow-lg transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  style={{ backgroundColor: '#ffffff', color: '#2563eb' }}
                >
                  Resume
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume PDF Viewer Modal */}
      <ResumeModal 
        isOpen={isResumeOpen} 
        onClose={() => setIsResumeOpen(false)} 
        resumeUrl={resumeUrl} 
      />
    </>
  );
}