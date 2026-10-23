import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { categories } from '../constants/categories';
import { NewItemPayload, Item } from '../types';

interface OfferItemProps {
  onItemAdded: (item: NewItemPayload) => Promise<Item>;
}

const OfferItem: React.FC<OfferItemProps> = ({ onItemAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [maxBorrowTime, setMaxBorrowTime] = useState('');
  const [isSubmitPending, setIsSubmitPending] = useState(false);

  const inputClass =
    'w-full px-4 py-2 border border-gray-200 rounded-lg focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary outline-none transition-all duration-200';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitPending(true);

    try {
      const newItem = {
        title,
        description,
        category,
        ownerEmail,
        maxBorrowTime,
      };

      await onItemAdded(newItem);
      setTitle('');
      setDescription('');
      setCategory('');
      setOwnerEmail('');
      setMaxBorrowTime('');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <PlusCircle className="h-6 w-6 mr-3 text-primary" aria-hidden="true" />
          List Your Item for Borrowing
        </h2>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          Share your belongings with fellow students and earn trust within our campus community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="item-title" className="block text-sm font-medium text-gray-700 mb-1">
            Item Title
          </label>
          <input
            id="item-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., DSLR Camera, Mountain Bike, Textbook"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="item-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="item-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item, its condition, and any specifics borrowers should know..."
            rows={3}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        <div>
          <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="item-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} cursor-pointer`}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="item-email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email (for contact)
          </label>
          <input
            id="item-email"
            type="email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            placeholder="your.email@hhu.de"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="item-borrow-time" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Borrow Time
          </label>
          <input
            id="item-borrow-time"
            type="text"
            value={maxBorrowTime}
            onChange={(e) => setMaxBorrowTime(e.target.value)}
            placeholder="e.g., 1 day, 1 week, 4 hours"
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitPending}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
          {isSubmitPending ? 'Submitting...' : 'List Item'}
        </button>
      </form>
    </div>
  );
};

export default OfferItem;
