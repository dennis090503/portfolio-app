import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dots = [];
    const spacing = 32; // Grid spacing in pixels
    const maxRadius = 80; // Cursor interaction radius in pixels
    const maxPushDistance = 35; // Maximum displacement distance

    const mouse = { x: -1000, y: -1000 };

    function initGrid() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Clear existing dots and kill GSAP tweens on old dots
      dots.forEach((dot) => gsap.killTweensOf(dot));
      dots.length = 0;

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * spacing;
          const baseY = j * spacing;
          dots.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            radius: 1.25,
            isDisplaced: false,
          });
        }
      }
    }

    initGrid();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      dots.forEach((dot) => {
        const dx = dot.baseX - mouse.x;
        const dy = dot.baseY - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxRadius) {
          // Calculate displacement force: (80 - dist) / 80
          const force = (maxRadius - dist) / maxRadius;
          const angle = Math.atan2(dy, dx);
          const targetX = dot.baseX + Math.cos(angle) * force * maxPushDistance;
          const targetY = dot.baseY + Math.sin(angle) * force * maxPushDistance;

          dot.isDisplaced = true;

          gsap.to(dot, {
            x: targetX,
            y: targetY,
            duration: 0.25,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        } else if (dot.isDisplaced) {
          dot.isDisplaced = false;

          gsap.to(dot, {
            x: dot.baseX,
            y: dot.baseY,
            duration: 0.65,
            ease: 'elastic.out(1, 0.5)',
            overwrite: 'auto',
          });
        }
      });
    };

    const handleResize = () => {
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Render dots dynamically adapting to active theme
      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(0, 240, 255, 0.25)' : 'rgba(30, 41, 59, 0.2)';
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      dots.forEach((dot) => gsap.killTweensOf(dot));
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
