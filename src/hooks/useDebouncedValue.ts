import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that only updates after `delay` ms of quiet — a tiny
 * debounce with no dependencies. Used to keep search from recomputing on every
 * keystroke while never blocking the input itself.
 */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
