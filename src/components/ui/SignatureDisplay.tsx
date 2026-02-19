import React from "react";

interface SignatureDisplayProps {
  value?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fallbackText?: string;
  maxWidth?: string;
  maxHeight?: string;
}

const SignatureDisplay: React.FC<SignatureDisplayProps> = ({
  value,
  alt = "Signature",
  className = "text-base font-medium text-gray-900 dark:text-slate-300",
  imageClassName = "max-w-full h-auto border rounded-lg shadow-sm",
  fallbackText = "--",
  maxWidth = "200px",
  maxHeight = "100px",
}) => {
  // Check if value is a base64 image (data URL format)
  const isBase64Image = (str: string): boolean => {
    return str.startsWith("data:image/");
  };

  // Check if value is a base64 string (without data URL prefix)
  const isBase64String = (str: string): boolean => {
    try {
      // Basic base64 validation - should be divisible by 4 and contain valid base64 characters
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return str.length % 4 === 0 && base64Regex.test(str) && str.length > 50; // Assume signatures are reasonably long
    } catch {
      return false;
    }
  };

  // Check if value is a URL pointing to an image
  const isImageUrl = (str: string): boolean => {
    try {
      const url = new URL(str);
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      return imageExtensions.some((ext) =>
        url.pathname.toLowerCase().endsWith(ext),
      );
    } catch {
      return false;
    }
  };

  // Convert base64 string to data URL
  const toDataUrl = (base64: string): string => {
    // If it's already a data URL, return as is
    if (base64.startsWith("data:")) {
      return base64;
    }
    // Assume it's a PNG signature if no format specified
    return `data:image/png;base64,${base64}`;
  };

  if (!value) {
    return <span className={className}>{fallbackText}</span>;
  }

  // Determine if we should display as image
  const shouldDisplayAsImage =
    isBase64Image(value) || isBase64String(value) || isImageUrl(value);

  if (shouldDisplayAsImage) {
    const imageSrc = isImageUrl(value) ? value : toDataUrl(value);

    return (
      <div className="signature-container">
        <img
          src={imageSrc}
          alt={alt}
          className={imageClassName}
          style={{
            maxWidth,
            maxHeight,
            objectFit: "contain",
          }}
          onError={(e) => {
            // Fallback to text if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = document.createElement("span");
            fallback.className = className;
            fallback.textContent = "Invalid signature format";
            target.parentNode?.appendChild(fallback);
          }}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alt}</p>
      </div>
    );
  }

  // Fallback to text display
  return <span className={className}>{value || fallbackText}</span>;
};

export default SignatureDisplay;
