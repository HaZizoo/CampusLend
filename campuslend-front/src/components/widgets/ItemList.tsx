import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import ItemCard from '../ItemCard';
import { SearchX, PackagePlus } from 'lucide-react';
import type { Item } from '../../types';

interface ItemListProps {
  items: Item[];
  onRequestBorrow?: (id: string) => void;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
  showRequestButtons?: boolean;
  /** The current search query — used to show a contextual empty state. */
  searchQuery?: string;
}

const ItemList = memo(
  ({
    items,
    onRequestBorrow,
    onDelete,
    deletingId,
    showRequestButtons = false,
    searchQuery,
  }: ItemListProps) => {
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
        <div className="text-center py-16 animate-fade-in" role="status" aria-live="polite">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {isSearching ? (
              <SearchX className="h-8 w-8 text-primary" aria-hidden="true" />
            ) : (
              <PackagePlus className="h-8 w-8 text-primary" aria-hidden="true" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isSearching ? 'No matching items found' : 'No items available yet'}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {isSearching
              ? `We couldn't find anything matching "${searchQuery}". Try a different search term.`
              : 'Be the first to add an item and start sharing with your campus community!'}
          </p>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
            <ItemCard
              item={item}
              onDelete={onDelete ?? (() => {})}
              onRequestBorrow={onRequestBorrow}
              deletingId={deletingId}
              showRequestButtons={showRequestButtons}
            />
          </div>
        ))}
      </div>
    );
  
  },
);

export default ItemList;
