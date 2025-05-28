import { useEffect, useState, type FC } from 'react';
import { NavLink } from 'react-router';
import { useVisibility } from '../../hooks/useVisibility';
import { useImageHeight } from '../../hooks/useImageHeight';
import Skeleton from '../Skeleton';
import { useStore } from '../../providers/context';

import type { IPhoto } from '../../types';

import { StyledImage, StyledImageWrapper } from './styles';

const Photo: FC<{
  photo: IPhoto;
}> = ({ photo }) => {
  const { cache, addToCache } = useStore();
  const [ref, visible] = useVisibility(0, !!cache[photo.id]);
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err?.message);
        } else {
          setError('An unknown error occurred while fetching the image.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage(false);
    fetchImage(true);
  }, [photo.src.medium, photo.src.original, imageSrc, visible, photo.id, cache, addToCache]);

  return (
    <NavLink to={`/photo/${photo.id}`} aria-label={photo.alt || `Photo #${photo.id}`}>
      <StyledImageWrapper ref={ref} $height={height}>
        {error ? (
          <p>{error}</p>
        ) : (
          <>
            {visible && !isLoading && imageSrc ? (
              <StyledImage src={imageSrc} alt={photo.alt} />
            ) : (
              <Skeleton $width={width} $height={height} className={visible ? 'animate' : ''} />
            )}
          </>
        )}
      </StyledImageWrapper>
    </NavLink>
  );
};

export default Photo;
