import React, { useState, useEffect } from 'react';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div
        className="pointer-events-none fixed top-0 left-0 rounded-full will-change-transform"
        style={{
          transform: `translate3d(${position.x - (isHovered ? 32 : 16)}px, ${position.y - (isHovered ? 32 : 16)}px, 0)`,
          width: isHovered ? '64px' : '32px',
          height: isHovered ? '64px' : '32px',
          backgroundColor: isHovered ? 'rgba(37, 99, 235, 0.18)' : 'rgba(37, 99, 235, 0.1)',
          border: `2px solid rgba(37, 99, 235, ${isHovered ? 0.6 : 0.35})`,
          boxShadow: isHovered 
            ? '0 0 40px rgba(37, 99, 235, 0.4), inset 0 0 20px rgba(37, 99, 235, 0.15)' 
            : '0 0 20px rgba(37, 99, 235, 0.15)',
          transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          zIndex: 99999,
          backdropFilter: 'blur(2px)',
        }}
      />
    </div>
  );
}