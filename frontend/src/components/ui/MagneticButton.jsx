import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function MagneticButton({ children, onClick, variant = 'primary', className }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const base =
    'relative px-8 py-3 rounded-full font-medium tracking-wide text-sm transition-colors duration-300 overflow-hidden';

  const variants = {
    primary: 'bg-primary text-white hover:shadow-glow',
    outline: 'border border-white/20 text-white hover:border-accent/60',
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.2 }}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </motion.button>
  );
}