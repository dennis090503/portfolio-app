import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { techStackIcons as staticTechStack } from '../../data/content';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TechStack() {
  const [techList, setTechList] = useState(staticTechStack);

  useEffect(() => {
    fetch(`${API_BASE}/techstack`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setTechList(data);
        }
      })
      .catch(err => {
        console.warn('TechStack API failed, running with static fallback.', err);
      });
  }, []);

  // Infinite floating physics setup
  const floatingAnimation = (i) => ({
    y: [0, -10, 0],
    transition: {
      duration: 3.5 + (i % 3) * 0.5, // Natural asynchronous offsets
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.1,
    }
  });

  return (
    <section id="techstack" className="relative py-16 md:py-24 overflow-hidden">
      {/* Centered Decorative Ambient Light Mask */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[300px] bg-accent/[0.02] rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Tech Stack" title="Always in motion" align="center" />

        {/* Dynamic Items Flex Wrap Wrapper */}
        <div className="relative mt-16 flex flex-wrap justify-center gap-3 md:gap-5 max-w-4xl mx-auto px-2">
          {techList.map((tech, i) => {
            const isObject = typeof tech === 'object' && tech !== null;
            const name = isObject ? tech.name : tech;
            const iconUrl = isObject ? tech.icon : null;

            return (
              <motion.div
                key={name + i}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.6, 
                  delay: i * 0.04, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="pointer-events-auto max-w-full"
              >
                <motion.div
                  animate={floatingAnimation(i)}
                  whileHover={{ 
                    scale: 1.06, 
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  className="bg-surface border border-line/70 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3.5 flex items-center gap-3 shadow-soft hover:shadow-card hover:border-accent/40 select-none cursor-default transition-shadow duration-300 group min-h-[44px] max-w-full"
                >
                  {/* Dynamic Icon Asset Slot */}
                  {iconUrl ? (
                    <img 
                      src={iconUrl} 
                      alt={name} 
                      loading="lazy"
                      className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                    />
                  ) : (
                    /* Minimalist geometric circle tag for local standard strings */
                    <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 flex-shrink-0" />
                  )}

                  <span className="text-sm font-semibold tracking-tight text-text-muted group-hover:text-primary transition-colors duration-300 truncate">
                    {name}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}