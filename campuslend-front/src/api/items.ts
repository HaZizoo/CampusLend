/**
 * API service for CampusLend items.
 * Performs REST calls to the Express backend.
 * Falls back to internal mock state when offline.
 */
/// <reference types="vite/client" />

import type { Item, NewItemPayload } from '../types';

// Base URL for API — configurable via environment variable
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Mock data for offline testing
const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'TI-84 Plus CE Graphic Calculator',
    category: 'Electronics',
    maxBorrowTime: '3 days',
    ownerEmail: 'student1@hhu.de',
    description: 'Great for Math 2 / Stats exam.',
    status: 'available',
  },
  {
    id: '2',
    title: 'Database System Concepts (8th Ed)',
    category: 'Books',
    maxBorrowTime: '1 week',
    ownerEmail: 'student2@hhu.de',
    description: 'Covering relational algebra and SQL.',
    status: 'reserved',
  },
  {
    id: '3',
    title: 'iFixit Precision Screwdriver Set',
    category: 'Tools',
    maxBorrowTime: '2 days',
    ownerEmail: 'student3@hhu.de',
    description: 'Has all bits for laptop repair.',
    status: 'active',
  },
  {
    id: '4',
    title: 'USB-C Multi-Port Adapter / Dongle',
    category: 'Electronics',
    maxBorrowTime: '5 days',
    ownerEmail: 'student4@hhu.de',
    description: 'HDMI + 3x USB 3.0 ports.',
    status: 'available',
  },
];

// Internal state fallback — initialized with mock data
let items: Item[] = [...MOCK_ITEMS];

/** Normalize an item to ensure the frontend `id` field is present. */
const normalizeItem = (item: Item): Item => ({
  ...item,
  id: item.id || item._id || '',
});

/** Fetch all items from the API, falling back to mock data if unavailable. */
export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await fetch(`${API_BASE}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    const data: Item[] = await response.json();
    const normalized = data.map(normalizeItem);
    items = normalized;
    return normalized;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('API unavailable, using internal state (mock data):', message);
    return items.map(normalizeItem);
  }
};

/** Add a new item via the API, falling back to local simulation. */
export const addItem = async (newItem: NewItemPayload): Promise<Item> => {
  try {
    const response = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (!response.ok) throw new Error('Failed to add item');
    const createdItem: Item = await response.json();
    const normalized = normalizeItem(createdItem);
    items.push(normalized);
    return normalized;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('API unavailable, simulating add:', message);
    const tempItem: Item = { ...newItem, id: Date.now().toString() };
    items.push(tempItem);
    return tempItem;
  }
};

/** Delete an item by ID via the API, falling back to local simulation. */
export const deleteItem = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
    items = items.filter(item => item.id !== id);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn('API unavailable, simulating delete:', message);
    items = items.filter(item => item.id !== id);
    return { success: true };
  }
};
