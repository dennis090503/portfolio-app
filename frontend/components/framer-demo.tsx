import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FramerDemo({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'p-6 rounded-2xl bg-surface border border-line shadow-soft flex flex-col items-center gap-4 text-center max-w-sm mx-auto',
        className
      )}
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-ink flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 text-accent" /> Framer Motion Ready
        </h3>
        <p className="text-sm text-text-muted mt-1">
          21st.dev & shadcn UI setup complete with combined <code className="text-accent font-mono">cn</code> utility!
        </p>
      </div>
    </motion.div>
  );
}
