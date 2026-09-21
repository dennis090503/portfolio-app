import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { stats, profile, education } from '../../data/content';

export default function About() {
  return (
    <section id="about" className="relative py-16 md:py-24 overflow-hidden">
      {/* Subtle Background Radial Glow (Enhances the glassmorphism effect) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="About Me" title="Building things that work" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mt-12 items-stretch">
          {/* Main Summary Block */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <GlassCard delay={0.1} className="h-full flex flex-col justify-center p-6 md:p-8">
              <p className="text-text-muted text-base md:text-lg leading-relaxed font-normal">
                {profile.summary}
              </p>
              <div className="w-12 h-[1px] bg-accent/30 my-6" />
              <p className="text-primary text-base md:text-lg leading-relaxed font-medium">
                I care about clean architecture as much as the end result — code that's easy to read today is code that's easy to extend tomorrow.
              </p>
            </GlassCard>

            {/* Education Highlight Card */}
            {education && (
              <GlassCard delay={0.2} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-1">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">Education</span>
                    <h4 className="text-base font-bold text-primary mt-1">{education.degree}</h4>
                    <p className="text-sm font-medium text-text-muted mt-0.5">{education.institution} • {education.location}</p>
                    <span className="text-xs text-text-muted/80 mt-1 block">{education.period}</span>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-5">
            {stats.map((stat, i) => (
              <GlassCard 
                key={stat.label} 
                delay={0.15 + i * 0.08} 
                hover={true} 
                className="flex flex-col justify-center items-center text-center p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-card group"
              >
                <motion.p 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className="text-3xl md:text-4xl font-bold tracking-tight text-gradient mb-2 group-hover:scale-105 transition-transform duration-300"
                >
                  {stat.value}
                </motion.p>
                <p className="text-text-muted text-xs md:text-sm font-medium tracking-wide uppercase">
                  {stat.label}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}