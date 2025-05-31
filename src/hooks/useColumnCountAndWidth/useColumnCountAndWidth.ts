import { useEffect, useState } from 'react';
import { getColumnsCount } from '../../utils/getColumnsCount/getColumnsCount';
import { getColumnsWidth } from '../../utils/getColumnsWidth/getColumnsWidth';

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
    let timeoutId: NodeJS.Timeout | null = null;
    let resizeOccurredInCooldown = false;

    const onResize = () => {
      if (timeoutId !== null) {
        resizeOccurredInCooldown = true;
        return;
      }
      setData({ count: getColumnsCount(), width: getColumnsWidth() });
      timeoutId = setTimeout(() => {
        if (resizeOccurredInCooldown) {
          setData({ count: getColumnsCount(), width: getColumnsWidth() });
        }
        timeoutId = null;
        resizeOccurredInCooldown = false;
      }, 100);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return data;
};
