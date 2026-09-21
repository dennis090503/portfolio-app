import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LiquidTransition({ isDark }) {
  const overlayRef = useRef(null);
  const [lastTheme, setLastTheme] = useState(isDark);

  useEffect(() => {
    // Only animate when the theme changes after mounting
    if (isDark === lastTheme) return;
    setLastTheme(isDark);

    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline();

    // Set liquid color based on the upcoming destination theme
    overlay.style.backgroundColor = isDark ? '#050507' : '#FAFAF8';

    // Grow liquid circle expanding outwards from top right navbar location
    tl.set(overlay, { display: 'block', clipPath: 'circle(0% at 85% 4%)', opacity: 1 })
      .to(overlay, {
        clipPath: 'circle(150% at 85% 4%)',
        duration: 0.9,
        ease: "power3.inInOut"
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        }
      });
  }, [isDark, lastTheme]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 hidden pointer-events-none z-[99999]"
    />
  );
}