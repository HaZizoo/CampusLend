import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchItems, deleteItem } from '../api/items';
import HeroSection from '../components/hero/HeroSection';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import ItemGrid from '../components/ItemGrid';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import useDebounce from '../hooks/useDebounce';
import { Item, MessageType } from '../types';

const HomePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>('success');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { ref: gridRef, isVisible: isGridVisible } = useScrollAnimation({ threshold: 0.05 });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Unable to connect to the campus network. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (debouncedSearchTerm.trim() !== '') {
        const term = debouncedSearchTerm.toLowerCase();
        return item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
      }
      return true;
    });
  }, [items, debouncedSearchTerm, selectedCategory]);

  const setTemporaryMessage = (msg: string, type: MessageType) => {
    setMessage(msg);
    setMessageType(type);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(null), 3000);
  };

  const handleItemDeleted = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setTemporaryMessage('Item deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting item:', err);
      setTemporaryMessage('Failed to delete item. Please try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      <HeroSection value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      {message && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 animate-fade-in fixed top-20 right-0 left-0 z-50 pointer-events-none">
          <div className={`max-w-md mx-auto shadow-lg rounded-xl p-4 flex items-center space-x-3 backdrop-blur-md border pointer-events-auto ${messageType === 'success' ? 'bg-success/90 border-success/20 text-white' : 'bg-error/90 border-error/20 text-white'
            }`}
          >
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 md:py-20" ref={gridRef}>
        {error ? (
          <div className="text-center py-12 glass rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-error font-medium mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium">
              Try Again
            </button>
          </div>
        ) : (
          <div className={`transition-all duration-700 transform ${isGridVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Campus <span className="text-primary">Inventory</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
                <div className="flex-1">
                  <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="sm:w-64">
                  <CategoryFilter value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} />
                </div>
              </div>
            </div>

            {loading ? (
              <SkeletonGrid count={8} />
            ) : (
              <ItemGrid items={filteredItems} onDelete={handleItemDeleted} deletingId={deletingId} searchQuery={debouncedSearchTerm} />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
