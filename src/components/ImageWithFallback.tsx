import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

/**
 * Image component that gracefully handles image load errors (broken URLs, network issues)
 * by rendering a colorful SVG illustration with the item name instead of a broken image icon.
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "",
  className = "",
  fallbackText,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Generate SVG Data URI for instant fallback
  const getSvgFallback = (text: string) => {
    const displayText = text || alt || "Hình minh họa";
    const bgColors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];
    // Deterministic color based on text length
    const color = bgColors[displayText.length % bgColors.length];
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="${color}" rx="24"/>
        <circle cx="200" cy="120" r="50" fill="white" opacity="0.25"/>
        <text x="200" y="130" font-family="sans-serif" font-size="48" font-weight="900" fill="white" text-anchor="middle" dominant-baseline="middle">
          ${displayText.charAt(0).toUpperCase()}
        </text>
        <rect x="40" y="200" width="320" height="60" fill="white" rx="16" opacity="0.95"/>
        <text x="200" y="238" font-family="sans-serif" font-size="22" font-weight="800" fill="#1E293B" text-anchor="middle">
          ${displayText}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  if (hasError || !src) {
    return (
      <img
        src={getSvgFallback(fallbackText || alt)}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        console.warn(`Image failed to load: ${src}`);
        setHasError(true);
      }}
      {...props}
    />
  );
};
