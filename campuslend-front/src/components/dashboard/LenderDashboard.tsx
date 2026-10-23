import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, User, DollarSign, Star, Search } from 'lucide-react';
import { fetchItems } from '../../api/items';
import { categories } from '../../constants/categories';
import type { Item } from '../../types';
import StatsCard from '../widgets/StatsCard';
import RatingSystem from '../widgets/RatingSystem';
import ItemList from '../widgets/ItemList';
import ActivityFeed from '../widgets/ActivityFeed';
import MessagingPlaceholder from '../widgets/MessagingPlaceholder';
import { SkeletonGrid } from '../SkeletonLoader';
import useDebounce from '../../hooks/useDebounce';

const MOCK_ACTIVITIES = [
  { id: '1', type: 'borrow' as const, title: 'Calculator borrowed by Alex', time: '2h ago', icon: 'ShoppingBag', color: 'primary' as const },
  { id: '2', type: 'return' as const, title: 'Textbook returned by Sam', time: '5h ago', icon: 'CheckCircle', color: 'success' as const },
  { id: '3', type: 'request' as const, title: 'New request for USB adapter', time: '1d ago', icon: 'Mail', color: 'warning' as const },
];

const LenderDashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'history'>('listings');
  const [userStats, setUserStats] = useState({
    itemsListed: 8,
    activeBorrows: 3,
    totalEarned: 120,
    satisfactionRate: 96,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems.slice(0, 4));
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
    { id: 'listings' as const, label: 'My Listings' },
    { id: 'requests' as const, label: 'Borrow Requests' },
    { id: 'history' as const, label: 'Past Transactions' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
          <p className="text-sm text-muted mt-1">Manage your listed items and track lending activity</p>
        </div>
        <RatingSystem
          score={userStats.satisfactionRate / 20}
          onRate={(newScore: number) => {
            setUserStats((prev) => ({
              ...prev,
              satisfactionRate: Math.round(newScore * 20),
            }));
          }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Items Listed" value={userStats.itemsListed} icon={ShoppingBag} trend="+2 this week" trendType="positive" />
        <StatsCard title="Active Borrows" value={userStats.activeBorrows} icon={User} trend="+1 this month" trendType="positive" />
        <StatsCard title="Total Earned" value={`$${userStats.totalEarned}`} icon={DollarSign} trend="+$25 this week" trendType="positive" />
        <StatsCard title="Satisfaction Rate" value={`${userStats.satisfactionRate}%`} icon={Star} trend="+2% this month" trendType="positive" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item Listings — 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200" role="tablist" aria-label="Lender dashboard tabs">
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

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search your listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search your listings"
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

          {/* Item Grid */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Listed Items</h2>
            {loading ? (
              <SkeletonGrid count={4} />
            ) : (
              <ItemList
                items={filteredItems}
                onDelete={(itemId: string) => console.log(`Delete item: ${itemId}`)}
                onRequestBorrow={(itemId: string) => console.log(`Borrow request: ${itemId}`)}
                showRequestButtons={true}
                searchQuery={debouncedSearchTerm}
              />
            )}
          </div>
        </div>

        {/* Sidebar — 1 column */}
        <div className="space-y-6">
          <ActivityFeed title="Recent Activity" activities={MOCK_ACTIVITIES} />
          <MessagingPlaceholder
            title="Campus Messages"
            onStartChat={(userId: string) => console.log(`Start chat with: ${userId}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default LenderDashboard;
