import React from 'react';
import { categories } from '../constants/categories';

interface CategoryFilterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
  const categoriesWithAll = ['All', ...categories];

  return (
    <div className="w-full">
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary outline-none transition-all duration-200 font-medium text-gray-700 cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
        aria-label="Filter by Category"
      >
        {categoriesWithAll.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
