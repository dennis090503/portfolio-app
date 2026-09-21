import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorContext = createContext();

export function CursorProvider({ children }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  // For the glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22 });
  
  // For the custom cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springCursorX = useSpring(cursorX, { stiffness: 200, damping: 25 });
  const springCursorY = useSpring(cursorY, { stiffness: 200, damping: 25 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      mouseX.set(x);
      mouseY.set(y);
      cursorX.set(x);
      cursorY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, cursorX, cursorY]);

  // Detect hoverable elements
  useEffect(() => {
    if (isTouch) return;

    const handleMouseOver = (e) => {
      const target = e.target;
      // Check if element or its parents have data-cursor attribute or are interactive
      let el = target;
      while (el && el !== document.body) {
        if (el.dataset?.cursor === 'hover' || 
            el.tagName === 'A' || 
            el.tagName === 'BUTTON' ||
            el.closest('[data-cursor="hover"]')) {
          setIsHovering(true);
          return;
        }
        el = el.parentElement;
      }
      setIsHovering(false);
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [isTouch]);

  const value = {
    isHovering,
    isTouch,
    smoothX,
    smoothY,
    springCursorX,
    springCursorY,
    setIsHovering
  };

  return (
    <CursorContext.Provider value={value}>
      {children}
      {!isTouch && <GlobalCursor />}
    </CursorContext.Provider>
  );
}

// Global Cursor Component
function GlobalCursor() {
  const { isHovering, springCursorX, springCursorY } = useContext(CursorContext);

  return (
    <>
      {/* Custom Cursor Ring */}
      <motion.div
        className="fixed pointer-events-none z-50 hidden md:block"
        style={{
          x: springCursorX,
          y: springCursorY,
          width: isHovering ? 60 : 30,
          height: isHovering ? 60 : 30,
          marginLeft: isHovering ? -30 : -15,
          marginTop: isHovering ? -30 : -15,
          border: `2px solid ${isHovering ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.3)'}`,
          borderRadius: '50%',
          boxShadow: isHovering ? '0 0 30px rgba(0, 240, 255, 0.2)' : 'none',
          transition: 'width 0.2s, height 0.2s, margin 0.2s, border-color 0.3s, box-shadow 0.3s',
        }}
      />

      {/* Center Dot */}
      <motion.div
        className="fixed pointer-events-none z-50 hidden md:block"
        style={{
          x: springCursorX,
          y: springCursorY,
          width: 4,
          height: 4,
          marginLeft: -2,
          marginTop: -2,
          borderRadius: '50%',
          background: isHovering ? '#00F0FF' : '#ffffff',
          boxShadow: isHovering ? '0 0 20px rgba(0, 240, 255, 0.5)' : 'none',
          transition: 'background 0.3s, box-shadow 0.3s',
        }}
      />

      {/* Glow Ring (Replaces the old CursorGlow component) */}
      <motion.div
        className="fixed pointer-events-none z-0 hidden md:block"
        style={{
          x: springCursorX,
          y: springCursorY,
          width: 400,
          height: 400,
          marginLeft: -200,
          marginTop: -200,
          borderRadius: '50%',
          background: isHovering 
            ? 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, transparent 70%)',
          transition: 'background 0.5s',
          filter: 'blur(40px)',
        }}
      />
    </>
  );
}

export const useCursor = () => useContext(CursorContext);