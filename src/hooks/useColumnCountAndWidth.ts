import { useEffect, useState } from 'react';
import { getColumnsCount } from '../utils/getColumnsCount';
import { getColumnsWidth } from '../utils/getColumnsWidth';

type ColumnData = {
  count: number;
  width: number;
};

export const useColumnCountAndWidth = () => {
  const [data, setData] = useState<ColumnData>({
    count: getColumnsCount(),
    width: getColumnsWidth(),
  });

  useEffect(() => {
    const onResize = () => setData({ count: getColumnsCount(), width: getColumnsWidth() });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return data;
};
