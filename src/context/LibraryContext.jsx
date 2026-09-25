import { createContext, useContext } from 'react';
import { useLibraryStore } from '../hooks/useLibraryStore.js';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const store = useLibraryStore();
  return <LibraryContext.Provider value={store}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return ctx;
}

export default LibraryContext;
