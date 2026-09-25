import { useEffect, useState } from 'react';
import { persist } from '../utils/libraryUtils.js';

/**
 * A small generic hook that mirrors a piece of React state into localStorage.
 * `key` is the localStorage key, `initialValue` seeds the state the first time
 * (the caller is responsible for reading any existing stored value up front —
 * see loadOrSeed() in useLibraryStore.js — this hook just keeps things in sync
 * going forward).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    persist(key, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
