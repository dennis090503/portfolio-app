"use client";

import React, { useEffect } from "react";
import { updateFavicon } from "../frontend/src/lib/favicon";

/**
 * Root Layout Component (Next.js App Router / Root Layout implementation)
 * Synchronizes website favicon with active theme on initial load or refresh.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initial Load / Sync on Mount:
    // Ensures favicon automatically matches active theme class (document.documentElement.classList.contains("dark"))
    const isDarkActive = document.documentElement.classList.contains("dark");
    updateFavicon(isDarkActive);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Dennis Lalwani — Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/png"
          href="https://res.cloudinary.com/jyki8xlq/image/upload/v1789872198/portfolio_favicon-image_light.png"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
