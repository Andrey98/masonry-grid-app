import { useEffect, useRef, useState } from 'react';
import { ROOT_MARGIN } from '../../constants';

export const useVisibility = (threshold = 0, isAlreadyInCache = false) => {
  const [visible, setVisible] = useState(isAlreadyInCache);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold,
      rootMargin: ROOT_MARGIN,
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
};
