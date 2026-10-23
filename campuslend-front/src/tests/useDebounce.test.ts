import { act, renderHook } from '@testing-library/react';
import useDebounce from '../hooks/useDebounce';
import { vi } from 'vitest';

describe('useDebounce', () => {
  test('should return the initial value', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  test('should update the value after the delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'updated', delay: 300 });
    });

    expect(result.current).toBe('initial'); // Not updated yet

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  test('should reset the timer when value changes', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    act(() => {
      rerender({ value: 'updated1', delay: 300 });
    });

    act(() => {
      vi.advanceTimersByTime(100); // Only 100ms passed
    });

    expect(result.current).toBe('initial'); // Still initial

    act(() => {
      rerender({ value: 'updated2', delay: 300 });
    });

    act(() => {
      vi.advanceTimersByTime(200); // Total 300ms from first change? Actually we reset, so wait 300ms from second change
    });

    expect(result.current).toBe('initial'); // Still not updated because we reset

    act(() => {
      vi.advanceTimersByTime(100); // Now 300ms from second change
    });

    expect(result.current).toBe('updated2');

    vi.useRealTimers();
  });
});