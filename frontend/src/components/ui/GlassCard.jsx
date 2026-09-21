import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function GlassCard({ children, className, hover = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -6, transition: { duration: 0.3 } } : undefined}
      className={cn(
        'glass rounded-2xl p-6 md:p-8',
        hover && 'hover:shadow-glow hover:border-accent/30 transition-shadow duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}