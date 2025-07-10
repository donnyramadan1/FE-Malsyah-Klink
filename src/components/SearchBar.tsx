"use client";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative max-w-xs ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSearch) {
            onSearch(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
