export interface IPhoto {
  id: number;
  alt: string;
  photographer: string;
  photographer_url: string;
  src: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  width: number;
  height: number;
}

export type ICache = Record<string, { isOriginalSize: boolean; blob: string }>;

export interface IStore {
  columnWidth: number;
  columnCount: number;
  photos: IPhoto[];
  cache: ICache;
  addToCache: (key: number, value: string, isOriginalSize: boolean) => void;
}
