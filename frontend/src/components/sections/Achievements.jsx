import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { achievements as staticAchievements } from '../../data/content';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Achievements() {
  const [certsList, setCertsList] = useState(staticAchievements);

  useEffect(() => {
    fetch(`${API_BASE}/certifications`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setCertsList(data);
        }
      })
      .catch(err => {
        console.warn('Certifications API failed, running with static fallback.', err);
      });
  }, []);

  return (
    <section id="achievements" className="relative py-16 md:py-24 overflow-hidden">
      {/* Decorative Accent Background Ray */}
      <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 -z-10 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Achievements" title="Certifications" />

        <div className="grid sm:grid-cols-2 gap-6 mt-14 items-stretch">
          {certsList.map((cert, i) => {
            // Flexible Data Normalization: Handles both basic strings and rich backend objects smoothly
            const isObject = typeof cert === 'object' && cert !== null;
            const title = isObject ? cert.title : cert;
            const issuer = isObject ? cert.issuer : null;
            const url = isObject ? cert.url : null;

            // Wrap in an interactive anchor if a link exists, otherwise use a div
            const CardContainer = url ? 'a' : 'div';

            return (
              <motion.div
                key={title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <CardContainer
                  href={url}
                  target={url ? "_blank" : undefined}
                  rel={url ? "noopener noreferrer" : undefined}
                  className={`group flex items-center justify-between gap-4 h-full bg-surface border border-line/60 rounded-2xl p-5 shadow-soft hover:shadow-card hover:border-accent/30 transition-all duration-300 ease-out ${
                    url ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon Ornament Wrapper */}
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl bg-background border border-line flex items-center justify-center text-text-muted group-hover:text-accent group-hover:bg-accent/[0.04] group-hover:border-accent/20 transition-all duration-300">
                      <Award size={16} className="transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    {/* Metadata Content */}
                    <div>
                      <h3 className="font-bold tracking-tight text-primary transition-colors duration-300 group-hover:text-accent text-sm md:text-base">
                        {title}
                      </h3>
                      {issuer && (
                        <p className="text-xs font-semibold text-text-muted mt-1 tracking-wide uppercase">
                          {issuer}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contextual Action Indicator Dot or Link Arrow */}
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                    {url ? (
                      <ArrowUpRight 
                        size={16} 
                        className="text-text-muted opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-line group-hover:bg-accent transition-colors duration-300" />
                    )}
                  </div>
                </CardContainer>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}