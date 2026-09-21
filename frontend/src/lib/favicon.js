export const LIGHT_FAVICON_URL =
  "https://res.cloudinary.com/jyki8xlq/image/upload/v1789872198/portfolio_favicon-image_light.png";
export const DARK_FAVICON_URL =
  "https://res.cloudinary.com/jyki8xlq/image/upload/v1789872200/portfolio_favicon-image_dark.png";

/**
 * Dynamically updates or creates the document's favicon based on theme mode or explicit image URL.
 *
 * @param {boolean | string} isDarkOrUrl - boolean indicating if Dark Mode is active, or explicit image URL string
 */
export function updateFavicon(isDarkOrUrl) {
  if (typeof window === "undefined" || !document) return;

  const targetUrl =
    typeof isDarkOrUrl === "string"
      ? isDarkOrUrl
      : isDarkOrUrl
      ? DARK_FAVICON_URL
      : LIGHT_FAVICON_URL;

  // Query all icon link elements (<link rel="icon"> and <link rel="shortcut icon">)
  const faviconLinks = document.querySelectorAll(
    "link[rel~='icon'], link[rel~='shortcut icon']"
  );

  if (faviconLinks.length === 0) {
    // If no favicon link tag exists in DOM, dynamically create one and append to document.head
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.type = "image/png";
    newLink.href = targetUrl;
    document.head.appendChild(newLink);
  } else {
    // Update href attribute for all existing favicon link elements
    faviconLinks.forEach((link) => {
      link.href = targetUrl;
      if (targetUrl.endsWith(".png") || targetUrl.includes("cloudinary.com")) {
        link.type = "image/png";
      }
    });
  }
}

/**
 * Helper to sync favicon with document root dark class state on initial mount or load.
 */
export function syncFaviconWithTheme() {
  if (typeof window === "undefined" || !document) return;
  const isDarkActive = document.documentElement.classList.contains("dark");
  updateFavicon(isDarkActive);
}
