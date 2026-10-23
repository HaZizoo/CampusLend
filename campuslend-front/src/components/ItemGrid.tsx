import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import ItemCard from './ItemCard';
import { SearchX, PackagePlus } from 'lucide-react';
import { Item } from '../types';

interface ItemGridProps {
  items: Item[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
  /** The current search query — used to show a contextual empty state. */
  searchQuery?: string;
}

const ItemGrid = memo(({ items, onDelete, deletingId, searchQuery }: ItemGridProps) => {
  const [hasSeen, setHasSeen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) {
    const isSearching = searchQuery && searchQuery.trim() !== '';
    return (
      <div className="text-center py-20 animate-fade-in" role="status" aria-live="polite">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          {isSearching ? (
            <SearchX className="h-10 w-10 text-primary" aria-hidden="true" />
          ) : (
            <PackagePlus className="h-10 w-10 text-primary" aria-hidden="true" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          {isSearching ? 'No matching items found' : 'No items available yet'}
        </h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          {isSearching
            ? `We couldn't find anything matching "${searchQuery}". Try a different search term or category.`
            : 'Be the first to add an item and start sharing with your campus community!'}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className="transition-all duration-500"
          style={
            {
              opacity: hasSeen ? 1 : 0,
              transform: hasSeen ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: `${index * 80}ms`,
            } as CSSProperties
          }
        >
          <ItemCard item={item} onDelete={onDelete} deletingId={deletingId} />
        </div>
      ))}
    </div>
  );
});

export default ItemGrid;
