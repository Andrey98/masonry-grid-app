import { useCallback, useEffect, useState, type FC, type MouseEventHandler } from 'react';
import { NavLink } from 'react-router';
import { useVisibility } from '../../hooks/useVisibility';
import { useImageHeight } from '../../hooks/useImageHeight';
import { Skeleton } from '../Skeleton';
import { useStore } from '../../providers/context';

import type { IPhoto } from '../../types';

import { StyledImage, StyledImageWrapper } from './styles';

export const Photo: FC<{
  photo: IPhoto;
  willTriggerNextPageFetch: boolean;
}> = ({ photo, willTriggerNextPageFetch }) => {
  const { cache, addToCache, fetchNextPage } = useStore();
  const [ref, visible] = useVisibility(0, !!cache[photo.id]);
  const { height, width } = useImageHeight(photo);

  const [imageSrc, setImageSrc] = useState<string | null>(cache[photo.id]?.blob || null);
  const [isLoading, setIsLoading] = useState(!cache[photo.id]);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback<MouseEventHandler>(
    event => {
      if (photo.isSkeleton) {
        event.preventDefault();
      }
    },
    [photo.isSkeleton]
  );

  const fetchImage = useCallback(
    async (isOriginal: boolean) => {
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
            addToCache(photo.id, objectURL, isOriginal);
          }
        }
      } catch (err: unknown) {
        if (!cache[photo.id]) {
          if (err instanceof Error) {
            setError(err?.message);
          } else {
            setError('An unknown error occurred while fetching the image.');
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [addToCache, cache, photo.id, photo.src.medium, photo.src.original]
  );

  useEffect(() => {
    if (imageSrc || !visible) {
      return;
    }

    if (!photo.src.medium) {
      setIsLoading(false);
      return;
    }

    if (cache[photo.id]?.isOriginalSize) {
      setIsLoading(false);
      setImageSrc(cache[photo.id].blob);
      return;
    }

    setImageSrc(null);
    setIsLoading(true);
    setError(null);

    fetchImage(false);
    fetchImage(true);
  }, [cache, fetchImage, imageSrc, photo.id, photo.src.medium, visible]);

  useEffect(() => {
    if (visible && willTriggerNextPageFetch) {
      fetchNextPage();
    }
  }, [fetchNextPage, visible, willTriggerNextPageFetch]);

  return (
    <NavLink
      to={`/photo/${photo.id}`}
      aria-label={photo.alt || `Photo #${photo.id}`}
      onClick={handleClick}
    >
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
