import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useColumnCountAndWidth } from '../hooks/useColumnCountAndWidth';
import { API_KEY } from '../constants';

import type { IPhoto, IStore } from '../types';

const StoreContext = createContext<IStore | null>(null);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const cache = useRef<Record<number, string>>({});
  const { count, width } = useColumnCountAndWidth();
  const [photos, setPhotos] = useState<IPhoto[]>(
    new Array(80).fill({ width: 200, height: 300, src: { medium: '' } })
  );

  const addToCache = useCallback(
    (key: number, value: string) => {
      cache.current[key] = value;
    },
    [cache.current]
  );

  useEffect(() => {
    fetch('https://api.pexels.com/v1/curated?per_page=80', {
      headers: {
        Authorization: API_KEY,
      },
    })
      .then(res => res.json())
      .then(data => setPhotos(data.photos));
  }, []);

  return (
    <StoreContext.Provider
      value={{ columnCount: count, columnWidth: width, photos, cache: cache.current, addToCache }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return store;
};
