import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CategoryFilter from '../components/CategoryFilter';

describe('CategoryFilter', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    render(<CategoryFilter value="All" onChange={onChange} />);
    onChange.mockClear();
  });

  test('renders the dropdown with categories', () => {
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('All');

    const options = select.querySelectorAll('option');
    const optionValues = Array.from(options).map(option => option.value);
    const expectedCategories = ['All', 'Electronics', 'Books', 'Sports', 'Musical Instruments', 'Tools', 'Furniture', 'Games', 'Other'];
    expect(optionValues).toEqual(expectedCategories);
  });

  test('calls onChange when category is selected', async () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('All');
    await userEvent.selectOptions(select, 'Electronics');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
