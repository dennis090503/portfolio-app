import React, { useState, useEffect } from 'react';
import SectionHeading from '../ui/SectionHeading';
import CarouselStacked from '../ui/carousel-07';
import { projects as staticProjects } from '../../data/content';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fallbackStockImages = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1000&q=80'
];

/**
 * Transforms raw project objects into CarouselStacked slide structure
 * preserving project preview images and technology stack tags
 */
const transformProjectsToSlides = (rawList) => {
  return rawList.map((item, idx) => {
    const stackList = Array.isArray(item.stack) 
      ? item.stack 
      : (typeof item.stack === 'string' && item.stack.trim() ? item.stack.split(',').map(s => s.trim()) : []);

    return {
      id: item._id || item.id || `proj-${idx}`,
      title: item.title,
      description: item.description,
      image: item.image && item.image.trim() !== '' ? item.image : fallbackStockImages[idx % fallbackStockImages.length],
      stack: stackList,
      badge: stackList.length > 0 ? stackList[0] : 'Full Stack',
      badges: stackList,
      demo: item.demo,
      github: item.github
    };
  });
};

export default function Projects() {
  const [slides, setSlides] = useState(() => transformProjectsToSlides(staticProjects));

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(transformProjectsToSlides(data));
        }
      })
      .catch((err) => {
        console.warn('Projects API failed or offline. Using static fallback projects.', err);
      });
  }, []);

  return (
    <section id="projects" className="relative py-16 md:py-24 overflow-hidden">
      {/* Decorative Ambient Background Ray */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Main Section Heading */}
        <SectionHeading eyebrow="Projects" title="Things I've built" />

        {/* Stacked Card Carousel */}
        <div className="w-full mt-8">
          <CarouselStacked slides={slides} />
        </div>

        {/* Live Total Projects Count Indicator Pill */}
        <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface/80 dark:bg-[#0B0B12]/80 border border-line/60 dark:border-[#1F1F2E] shadow-lg backdrop-blur-md transition-all hover:border-accent/40">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
          </span>

          <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">
            Total Projects: <span className="text-accent font-bold">{slides.length}</span>
          </span>
        </div>
      </div>
    </section>
  );
}