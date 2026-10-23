import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative group w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder="Search for items..."
        value={value}
        onChange={onChange}
        aria-label="Search for items"
        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary outline-none transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
