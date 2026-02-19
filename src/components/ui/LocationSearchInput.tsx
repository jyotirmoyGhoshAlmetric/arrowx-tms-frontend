import React, { useState, useEffect, useRef } from "react";

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface LocationSearchInputProps {
  value: string;
  onChange: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search for location...",
  className = "",
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Update search term when value prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_NOMINATIM_API_BASE_URL}/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=5&addressdetails=1`,
      );

      if (!response.ok) {
        throw new Error("Failed to search locations");
      }

      const data: LocationResult[] = await response.json();
      setResults(data);
      setShowResults(data.length > 0);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to search locations",
      );
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  const handleSelectLocation = (location: LocationResult) => {
    const locationData: LocationData = {
      address: location.display_name,
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };

    setSearchTerm(location.display_name);
    setShowResults(false);
    onChange(locationData);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 text-white-900 dark:text-white" ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          } ${className}`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 rounded-md p-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {results.map((location) => (
            <div
              key={location.place_id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelectLocation(location)}
            >
              <div className="flex items-start">
                <svg
                  className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {location.display_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lat: {parseFloat(location.lat).toFixed(6)}, Lng:{" "}
                    {parseFloat(location.lon).toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
