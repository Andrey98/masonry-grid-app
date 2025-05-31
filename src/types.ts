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
  isSkeleton?: boolean;
}

export interface IResponseData {
  photos: IPhoto[];
  next_page: string;
}

export type ICache = Record<string, { isOriginalSize: boolean; blob: string }>;

export interface IStore {
  columnWidth: number;
  columnCount: number;
  photos: IPhoto[];
  cache: ICache;
  addToCache: (key: number, value: string, isOriginalSize: boolean) => void;
  fetchNextPage: () => void;
  search: string;
  setSearch: (value: string) => void;
}
