import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { skills as staticSkills } from '../../data/content';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Formatter to clean up camelCase object keys into uppercase title sentences
const formatCategoryName = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase());
};

export default function Skills() {
  const [skillsData, setSkillsData] = useState(staticSkills);

  useEffect(() => {
    fetch(`${API_BASE}/skills`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          // Format from [{ category: 'Frontend', items: [...] }] to { Frontend: [...] }
          const formatted = {};
          data.forEach(item => {
            formatted[item.category] = item.items;
          });
          setSkillsData(formatted);
        }
      })
      .catch(err => {
        console.warn('Skills API failed, running with static fallback.', err);
      });
  }, []);

  const categories = Object.entries(skillsData);

  // Framer Motion Parent Stagger Configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  // Individual Card Animation Definitions
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section id="skills" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Decorator Ambient Light Ray */}
      <div className="absolute top-1/3 right-10 -z-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Skills" title="Tools I work with" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-14"
        >
          {categories.map(([category, items]) => (
            <motion.div
              key={category}
              variants={cardVariants}
              whileHover={{ rotateX: -3, rotateY: 3, y: -6 }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="bg-surface border border-line/60 rounded-3xl p-6 sm:p-7 shadow-soft hover:shadow-card hover:border-accent/30 transition-all duration-400 ease-out max-w-full overflow-hidden"
            >
              {/* Category Header */}
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-6">
                {formatCategoryName(category)}
              </h3>

              {/* Badges Container Grid Layout */}
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-background dark:bg-[#151522] border border-line dark:border-[#1F1F2E] text-text-muted dark:text-neutral-300 hover:text-primary dark:hover:text-[#FF007A] hover:bg-surface dark:hover:border-[#FF007A]/40 shadow-sm transition-all duration-300 min-h-[44px] flex items-center justify-center max-w-full truncate"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}