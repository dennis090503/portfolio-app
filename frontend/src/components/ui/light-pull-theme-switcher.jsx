"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { updateFavicon, DARK_FAVICON_URL, LIGHT_FAVICON_URL } from "../../lib/favicon";

export function LightPullThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();

  // Sync favicon on mount based on active theme state
  useEffect(() => {
    const isDarkActive = document.documentElement.classList.contains("dark");
    updateFavicon(isDarkActive ? DARK_FAVICON_URL : LIGHT_FAVICON_URL);
  }, []);

  const handleToggle = () => {
    const nextIsDark = !isDark;
    toggleTheme();
    updateFavicon(nextIsDark ? DARK_FAVICON_URL : LIGHT_FAVICON_URL);
  };

  return (
    <div className="relative flex items-end justify-center h-full pb-1 select-none z-50">
      <motion.div
        drag="y"
        dragDirectionLock
        onDragEnd={(_e, info) => {
          if (info.offset.y > 0 || info.velocity.y > 50) {
            handleToggle();
          }
        }}
        onClick={handleToggle}
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
        dragElastic={0.075}
        whileDrag={{ cursor: "grabbing" }}
        className="relative z-10 w-7 h-7 rounded-full cursor-grab
                   bg-[radial-gradient(circle_at_center,_#facc15,_#fcd34d,_#fef9c3)] 
                   dark:bg-[radial-gradient(circle_at_center,_#4b5563,_#1f2937,_#000)] 
                   shadow-[0_0_12px_4px_rgba(250,204,21,0.5)] 
                   dark:shadow-[0_0_12px_4px_rgba(31,41,55,0.7)]"
        title="Pull cord string to switch theme"
      >
        {/* Line extends upward inside the navbar boundary */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[1px] h-12 bg-amber-400/80 dark:bg-neutral-600 pointer-events-none" />
      </motion.div>
    </div>
  );
}

export default LightPullThemeSwitcher;

