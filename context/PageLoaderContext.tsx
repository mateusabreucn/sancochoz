"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

interface PageLoaderContextValue {
  loaderDone: boolean;
  markLoaderDone: () => void;
}

// Default loaderDone to true so components rendered outside the provider
// still play their entrance animations
const PageLoaderContext = createContext<PageLoaderContextValue>({
  loaderDone: true,
  markLoaderDone: () => {},
});

export function PageLoaderProvider({ children }: { children: ReactNode }) {
  const [loaderDone, setLoaderDone] = useState(false);
  const markLoaderDone = useCallback(() => setLoaderDone(true), []);
  const value = useMemo(
    () => ({ loaderDone, markLoaderDone }),
    [loaderDone, markLoaderDone]
  );

  return (
    <PageLoaderContext.Provider value={value}>
      {children}
    </PageLoaderContext.Provider>
  );
}

export const usePageLoader = () => useContext(PageLoaderContext);
