import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-line/40 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Dennis Lalwani. Built with React, GSAP &amp; Three.js.
        </p>

        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors min-h-[44px] px-3 py-2"
          aria-label="Back to top"
        >
          Back to top
          <ArrowUp size={16} />
        </motion.button>
      </div>
    </footer>
  );
}