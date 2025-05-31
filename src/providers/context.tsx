import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useColumnCountAndWidth } from '../hooks/useColumnCountAndWidth';
import { API_KEY, PER_PAGE } from '../constants';

import type { ICache, IPhoto, IResponseData, IStore } from '../types';

const StoreContext = createContext<IStore | null>(null);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Alternatively, this cache could be implemented using IndexedDB for more persistent storage,
  // which would allow the cached data to be available even after a page reload or browser restart.
  // However, for simplicity in this implementation and to ensure the cache is cleared on reload
  // it's currently stored in a React ref variable, making it an in-memory cache tied to the component's lifecycle.
  const cache = useRef<ICache>({});

  const { count, width } = useColumnCountAndWidth();
  const [nextPage, setNextPage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<IPhoto[]>(
    new Array(PER_PAGE)
      .fill({ width: 200, height: 300, src: { medium: '' }, isSkeleton: true })
      .map((item, i) => ({ ...item, id: i }))
  );

  const addToCache = useCallback((key: number, value: string, isOriginalSize: boolean) => {
    cache.current[key] = { blob: value, isOriginalSize };
  }, []);

  const fetchNextPage = useCallback(() => {
    console.log(nextPage, loading);
    if (nextPage && !loading) {
      setLoading(true);
      fetch(nextPage, {
        headers: {
          Authorization: API_KEY,
        },
      })
        .then(res => res.json())
        .then((data: IResponseData) => {
          setPhotos(prev => [...prev, ...data.photos]);
          setNextPage(data.next_page || '');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, nextPage]);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.pexels.com/v1/curated?per_page=${PER_PAGE}`, {
      headers: {
        Authorization: API_KEY,
      },
    })
      .then(res => res.json())
      .then((data: IResponseData) => {
        setPhotos(data.photos);
        setNextPage(data.next_page || '');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        columnCount: count,
        columnWidth: width,
        photos,
        cache: cache.current,
        addToCache,
        fetchNextPage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
