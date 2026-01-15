import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClear: () => void;
  isFocused: boolean;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onClear,
  isFocused,
  placeholder = "Search..."
}: SearchBarProps) => {
  return (
    <div className="p-3 border-b border-gray-700">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full bg-gray-700 text-white pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        {isFocused && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onClear();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
};