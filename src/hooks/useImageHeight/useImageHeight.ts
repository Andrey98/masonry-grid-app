import { useEffect, useState } from 'react';
import { useStore } from '../../providers/context';

import type { IPhoto } from '../../types';

export const useImageHeight = (photo: IPhoto) => {
  const { columnWidth, columnCount } = useStore();
  const [dimensions, setDimensions] = useState({
    height: (photo.height / photo.width) * columnWidth,
    width: columnWidth,
  });

  useEffect(() => {
    setDimensions({ height: (photo.height / photo.width) * columnWidth, width: columnWidth });
  }, [columnWidth, columnCount, photo.height, photo.width]);

  return dimensions;
};
