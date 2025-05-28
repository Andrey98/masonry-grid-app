export interface IPhoto {
  id: number;
  alt: string;
  photographer: string;
  src: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  width: number;
  height: number;
}

export interface IStore {
  columnWidth: number;
  columnCount: number;
  photos: IPhoto[];
  cache: Record<string, string>;
  addToCache: (key: number, value: string) => void;
}
