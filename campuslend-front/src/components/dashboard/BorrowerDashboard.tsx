import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, CheckCircle, Star, DollarSign, Search } from 'lucide-react';
import { fetchItems } from '../../api/items';
import { categories } from '../../constants/categories';
import type { Item } from '../../types';
import StatsCard from '../widgets/StatsCard';
import RatingSystem from '../widgets/RatingSystem';
import ItemList from '../widgets/ItemList';
import { SkeletonGrid } from '../SkeletonLoader';
import useDebounce from '../../hooks/useDebounce';

const BorrowerDashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'available' | 'borrows' | 'requests'>('available');
  const [userStats, setUserStats] = useState({
    activeBorrows: 3,
    returnedItems: 12,
    communityScore: 4.8,
    totalSaved: 240,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (debouncedSearchTerm.trim() !== '') {
        const term = debouncedSearchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [items, debouncedSearchTerm, selectedCategory]);

  const tabs = [
    { id: 'available' as const, label: 'Available Items' },
    { id: 'borrows' as const, label: 'My Borrows' },
    { id: 'requests' as const, label: 'Requests' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Borrower Dashboard</h1>
        <RatingSystem
          score={userStats.communityScore}
          onRate={(newScore: number) => {
            setUserStats((prev) => ({ ...prev, communityScore: newScore }));
          }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Active Borrows" value={userStats.activeBorrows} icon={ShoppingBag} trend="+2 this week" trendType="positive" />
        <StatsCard title="Items Returned" value={userStats.returnedItems} icon={CheckCircle} trend="+5 this month" trendType="positive" />
        <StatsCard title="Community Score" value={userStats.communityScore} icon={Star} trend="+0.2 this month" trendType="positive" />
        <StatsCard title="Total Saved" value={`$${userStats.totalSaved}`} icon={DollarSign} trend="+$45 this week" trendType="positive" />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200" role="tablist" aria-label="Borrower dashboard tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted hover:text-primary border-transparent hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search for items to borrow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for items to borrow"
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 outline-none transition-all font-medium text-gray-700"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 outline-none transition-all font-medium text-gray-700 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Item Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Available Items for Borrowing
        </h2>
        <p className="text-muted mb-6">
          Browse items shared by fellow students and request to borrow them
        </p>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <ItemList
            items={filteredItems}
            onRequestBorrow={(itemId: string) => {
              console.log(`Request to borrow item: ${itemId}`);
            }}
            showRequestButtons={true}
            searchQuery={debouncedSearchTerm}
          />
        )}
      </div>
    </div>
  );
};

export default BorrowerDashboard;
