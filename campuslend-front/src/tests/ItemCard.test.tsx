import { render, screen, fireEvent } from '@testing-library/react';
import ItemCard from '../components/ItemCard';
import { Item } from '../types';
import { vi } from 'vitest';

const mockItem: Item = {
  _id: '1',
  id: '1',
  title: 'Test Item',
  description: 'This is a test item',
  category: 'Electronics',
  ownerEmail: 'test@example.com',
  maxBorrowTime: '1 week',
};

describe('ItemCard', () => {
  test('renders item details correctly', () => {
    render(<ItemCard item={mockItem} onDelete={vi.fn()} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('This is a test item')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('1 week max')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  test('displays category badge with correct styling', () => {
    render(<ItemCard item={mockItem} onDelete={vi.fn()} />);
    const categoryBadge = screen.getByText('Electronics');
    expect(categoryBadge).toHaveClass('bg-primary/10');
    expect(categoryBadge).toHaveClass('text-primary');
    expect(categoryBadge).toHaveClass('rounded-full');
  });

  test('calls onDelete when delete button is clicked and confirmed', () => {
    const onDeleteMock = vi.fn();
    render(<ItemCard item={mockItem} onDelete={onDeleteMock} />);

    const deleteButton = screen.getByRole('button', { name: /Remove Listing/i });
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByRole('button', { name: /Confirm/i });
    fireEvent.click(confirmDeleteButton);

    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });

  test('shows request to borrow button when email is valid', () => {
    render(<ItemCard item={mockItem} onDelete={vi.fn()} showRequestButtons={true} />);
    const requestButton = screen.getByRole('button', { name: /Request to Borrow/i });
    expect(requestButton).toBeInTheDocument();
    expect(requestButton).toHaveClass('bg-primary');
    expect(requestButton).toHaveClass('text-white');
  });

  test('shows contact unavailable button when email is invalid', () => {
    const invalidItem: Item = { ...mockItem, ownerEmail: 'invalid-email' };
    render(<ItemCard item={invalidItem} onDelete={vi.fn()} showRequestButtons={true} />);

    // We match by text content because the button might be disabled.
    const contactButton = screen.getByText(/Contact Unavailable/i).closest('button');
    expect(contactButton).toBeInTheDocument();
    expect(contactButton).toBeDisabled();
  });
});