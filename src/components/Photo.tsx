import { useEffect, useState, type FC } from 'react';
import { useVisibility } from '../hooks/useVisibility';
import { useImageHeight } from '../hooks/useImageHeight';
import Skeleton from './Skeleton';

import type { IPhoto } from '../types';
import { useStore } from '../providers/context';

const Photo: FC<{
  photo: IPhoto;
}> = ({ photo }) => {
  const { cache, addToCache } = useStore();
  const [ref, visible] = useVisibility(0);
  const { height, width } = useImageHeight(photo);

  const [imageSrc, setImageSrc] = useState<string | null>(cache[photo.id] || null);
  const [isLoading, setIsLoading] = useState(!cache[photo.id]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageSrc || !visible) {
      return;
    }

    if (!photo.src.medium) {
      setIsLoading(false);
      return;
    }

    if (cache[photo.id]) {
      setIsLoading(false);
      setImageSrc(cache[photo.id]);
      return;
    }

    setImageSrc(null);
    setIsLoading(true);
    setError(null);

    const fetchImage = async (isOriginal: boolean) => {
      try {
        const response = await fetch(isOriginal ? photo.src.original : photo.src.medium);
        const imageBlob = await response.blob();
        const objectURL = URL.createObjectURL(imageBlob);

        if (!response.ok) {
          if (!cache[photo.id]) {
            throw new Error(`Failed to fetch image.`);
          }
        } else {
          if (isOriginal || !cache[photo.id]) {
            setImageSrc(objectURL);
            addToCache(photo.id, objectURL);
          }
        }
      } catch (err: Error | any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage(false);
    fetchImage(true);
  }, [photo.src.medium, photo.src.original, imageSrc, visible]);

  return (
    <div ref={ref} style={{ height }}>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {visible && !isLoading && imageSrc ? (
            <img
              src={imageSrc}
              alt={photo.alt}
              style={{
                width: '100%',
                borderRadius: '8px',
                height: '100%',
              }}
            />
          ) : (
            <Skeleton width={width} height={height} className={visible ? 'animate' : ''} />
          )}
        </>
      )}
    </div>
  );
};

export default Photo;
