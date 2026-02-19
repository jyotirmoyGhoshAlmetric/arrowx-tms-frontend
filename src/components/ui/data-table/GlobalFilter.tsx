import React, { useState, useEffect } from "react";
import TextInput from "@/components/ui/TextInput";
import { useDebounce } from "@/hooks/useDebounce";

type GlobalFilterProps = {
  filter: string;
  setFilter: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
};

const GlobalFilter: React.FC<GlobalFilterProps> = ({
  filter,
  setFilter,
  debounceMs = 0,
  placeholder = "search...",
}) => {
  const [localValue, setLocalValue] = useState(filter);
  const debouncedValue = useDebounce(localValue, debounceMs);

  // Update local value when filter prop changes (for controlled behavior)
  useEffect(() => {
    setLocalValue(filter);
  }, [filter]);

  // Call setFilter when debounced value changes
  useEffect(() => {
    if (debounceMs > 0 && debouncedValue !== filter) {
      setFilter(debouncedValue);
    }
  }, [debouncedValue, setFilter, filter, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);

    // If no debouncing, call setFilter immediately
    if (debounceMs === 0) {
      setFilter(value);
    }
  };

  return (
    <div>
      <TextInput
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default GlobalFilter;
