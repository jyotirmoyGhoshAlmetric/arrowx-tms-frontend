import React from "react";

interface ValueDisplayProps {
  value?: string | null;
  className?: string;
  isSignature?: boolean;
  alt?: string;
}

/**
 * Smart value display component that automatically detects and displays:
 * - Base64 images as <img> elements
 * - Image URLs as <img> elements
 * - Regular text values as <span> elements
 */
const ValueDisplay: React.FC<ValueDisplayProps> = ({
  value,
  className = "text-base font-medium text-gray-900 dark:text-slate-300",
  isSignature = false,
  alt = "Image",
}) => {
  // Helper to check if string is a base64 image
  const isBase64Image = (str: string): boolean => {
    return (
      str.startsWith("data:image/") ||
      (str.length > 50 &&
        /^[A-Za-z0-9+/]*={0,2}$/.test(str) &&
        str.length % 4 === 0)
    );
  };

  // Helper to check if string is an image URL
  const isImageUrl = (str: string): boolean => {
    try {
      const url = new URL(str);
      return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].some((ext) =>
        url.pathname.toLowerCase().endsWith(ext),
      );
    } catch {
      return false;
    }
  };

  // Convert base64 to data URL if needed
  const getImageSrc = (str: string): string => {
    if (str.startsWith("data:image/")) return str;
    if (isImageUrl(str)) return str;
    return `data:image/png;base64,${str}`;
  };

  if (!value) {
    return <span className={className}>--</span>;
  }

  // Check if we should display as image
  const shouldShowAsImage =
    isSignature || isBase64Image(value) || isImageUrl(value);

  if (shouldShowAsImage) {
    return (
      <div className="w-[250px] h-[60px] p-2 flex items-center justify-center border border-dashed border-black-300 rounded-lg">
        <img
          src={getImageSrc(value)}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="${className}">Invalid image</span>`;
            }
          }}
        />
      </div>
    );
  }

  return <span className={className}>{value}</span>;
};

export default ValueDisplay;
