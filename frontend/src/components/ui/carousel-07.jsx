"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export function CarouselStacked({ slides = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 border border-line/40 rounded-3xl bg-surface/50 text-text-muted">
        No portfolio slides available.
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Compute visible stack: top card + up to 2 stacked background cards
  const visibleCards = Array.from({ length: Math.min(3, slides.length) }, (_, i) => {
    const slideIndex = (currentIndex + i) % slides.length;
    return {
      slide: slides[slideIndex],
      stackPosition: i, // 0 = front/top, 1 = middle, 2 = back
      slideIndex,
    };
  });

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none py-4">
      {/* Stack Deck Container */}
      <div className="relative w-full aspect-[4/4] sm:aspect-[16/10.5] flex items-center justify-center">
        {visibleCards.reverse().map(({ slide, stackPosition, slideIndex }) => {
          const isTop = stackPosition === 0;

          // Compute motion offsets for stacked depth effect
          const scale = 1 - stackPosition * 0.06;
          const translateY = stackPosition * 18;
          const zIndex = 30 - stackPosition * 10;
          const opacity = 1 - stackPosition * 0.2;

          const techList = slide.stack || slide.badges || (slide.badge ? [slide.badge] : []);

          // Resolve the primary clickable URL (demo preferred, github as fallback)
          const cardHref =
            slide.demo && slide.demo.trim() !== '' && slide.demo.trim() !== '#'
              ? slide.demo
              : slide.github && slide.github.trim() !== '' && slide.github.trim() !== '#'
              ? slide.github
              : null;

          const CardWrapper = ({ children }) =>
            isTop && cardHref ? (
              <a
                href={cardHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'contents' }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open ${slide.title}`}
              >
                {children}
              </a>
            ) : (
              <>{children}</>
            );

          return (
            <CardWrapper key={slide.id || `${slide.title}-${slideIndex}-wrapper`}>
              <motion.div
                key={slide.id || `${slide.title}-${slideIndex}`}
                style={{ zIndex }}
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{
                  scale,
                  y: translateY,
                  opacity,
                  rotate: isTop ? 0 : stackPosition % 2 === 1 ? 2 : -2,
                }}
                exit={{ scale: 0.8, y: -40, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (isTop) {
                    if (info.offset.x < -70 || info.velocity.x < -300) {
                      handleNext();
                    } else if (info.offset.x > 70 || info.velocity.x > 300) {
                      handlePrev();
                    }
                  }
                }}
                whileGrab={isTop ? { cursor: "grabbing" } : {}}
                className={`absolute inset-0 w-full h-full rounded-3xl bg-surface dark:bg-[#0B0B12] border border-line/80 dark:border-[#1F1F2E] shadow-2xl overflow-hidden flex flex-col justify-between ${
                  isTop
                    ? `shadow-[0_20px_50px_rgba(0,240,255,0.12)] ${cardHref ? 'cursor-pointer' : 'cursor-grab'}`
                    : "pointer-events-none"
                }`}
              >
                {/* Project Preview Image */}
                <div className="relative w-full h-36 sm:h-48 overflow-hidden bg-background border-b border-line/40 select-none flex-shrink-0">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-background via-surface to-accent/10 flex items-center justify-center p-4">
                      <span className="font-display font-bold text-3xl text-accent/40 tracking-wider">
                        {slide.title.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body Content */}
                <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-primary mb-1.5">
                      {slide.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-3 line-clamp-3 sm:line-clamp-3 font-normal">
                      {slide.description}
                    </p>

                    {/* Clean Tech Stack Tags Display */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {techList.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-background border border-line/80 dark:border-[#2A2A3C] text-text-muted dark:text-gray-300 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Demo Link */}
                  {slide.demo && slide.demo.trim() !== '' && slide.demo.trim() !== '#' && (
                    <div className="pt-3 border-t border-line/40 flex items-center justify-between mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                        <span>Explore Live Demo</span>
                        <ExternalLink size={14} />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </CardWrapper>
          );
        })}
      </div>

      {/* Control Actions & Pagination Dots */}
      <div className="mt-8 flex items-center gap-6 z-40">
        <button
          onClick={handlePrev}
          aria-label="Previous Project"
          className="p-3 rounded-full bg-surface dark:bg-[#151522] border border-line/60 hover:border-accent hover:text-accent transition-all active:scale-95 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-accent shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                  : "w-2.5 bg-line/60 hover:bg-line"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next Project"
          className="p-3 rounded-full bg-surface dark:bg-[#151522] border border-line/60 hover:border-accent hover:text-accent transition-all active:scale-95 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default CarouselStacked;
