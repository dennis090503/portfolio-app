import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { experience as staticExperience } from '../../data/content';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Experience() {
  const [expList, setExpList] = useState(staticExperience);

  useEffect(() => {
    fetch(`${API_BASE}/experiences`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setExpList(data);
        }
      })
      .catch(err => {
        console.warn('Experience API failed, running with static fallback.', err);
      });
  }, []);

  return (
    <section id="experience" className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Experience" title="Where I've worked" />

        <div className="relative mt-16 pl-8 md:pl-10">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />

          {expList.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-14 last:mb-0"
            >
              <span className="absolute -left-[39px] md:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent shadow-glow-cyan" />

              <div className="glass rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-colors duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-semibold">{job.role}</h3>
                  <span className="text-xs uppercase tracking-wider text-text-muted">
                    {job.period}
                  </span>
                </div>
                <p className="text-accent text-sm mb-4">{job.company}</p>
                <ul className="space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="text-text-muted text-sm leading-relaxed flex gap-2">
                      <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}