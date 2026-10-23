import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import { vi } from 'vitest';

vi.mock('../api/items', () => ({
  fetchItems: vi.fn().mockResolvedValue([]),
  addItem: vi.fn().mockResolvedValue({}),
  deleteItem: vi.fn().mockResolvedValue(undefined),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Page Smoke Tests', () => {
  test('HomePage renders without throwing', async () => {
    render(<HomePage />, { wrapper });
    // We check for the text "Inventory" since "Campus Inventory" is split across elements.
    expect(await screen.findByText(/inventory/i)).toBeInTheDocument();
  });

  test('AboutPage renders without throwing', async () => {
    render(<AboutPage />, { wrapper });
    // "About CampusLend" is split across <h1> and <span> elements.
    expect(await screen.findByText(/about/i)).toBeInTheDocument();
    expect(await screen.findByText(/campuslend/i)).toBeInTheDocument();
  });

  test('NotFoundPage renders without throwing', async () => {
    render(<NotFoundPage />, { wrapper });
    expect(await screen.findByText(/404/i)).toBeInTheDocument();
    expect(await screen.findByText(/page not found/i)).toBeInTheDocument();
  });
});
