import { ScrollRestoration, useParams } from 'react-router';
import { useStore } from '../../providers/context';
import { useEffect, useState } from 'react';
import type { IPhoto } from '../../types';
import { API_KEY } from '../../constants';
import {
  StyledBackButton,
  StyledDescription,
  StyledDetailViewContainer,
  StyledLargePhoto,
  StyledPhotoInfo,
  StyledPhotoWrapper,
  StyledPhotoAndInfoWrapper,
  StyledTitle,
  StyledSkeletonForPhotoPage,
  StyledSkeletonsWrapper,
} from './styles';
import Skeleton from '../../components/Skeleton';

export default function PhotoPage() {
  const { id } = useParams();
  const { cache, addToCache } = useStore();

  const [photo, setPhoto] = useState<IPhoto | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(cache[id || ''] || null);
  const [error, setError] = useState<string | null>(id ? null : 'Wrong photo ID');

  useEffect(() => {
    if (!id) {
      setError('Photo ID is required');
      return;
    }
    (async () => {
      if (!photo) {
        const response = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
          headers: {
            Authorization: API_KEY,
          },
        });
        if (!response.ok) {
          setError(`Failed to fetch photo with ID ${id}`);
        } else {
          const data: IPhoto = await response.json();
          setPhoto(data);
        }
        return;
      }

      const fetchImage = async (isOriginal: boolean) => {
        try {
          const response = await fetch(isOriginal ? photo.src.original : photo.src.medium);
          const imageBlob = await response.blob();
          const objectURL = URL.createObjectURL(imageBlob);

          if (!response.ok) {
            if (!cache[id]) {
              throw new Error(`Failed to fetch image.`);
            }
          } else {
            if (isOriginal || !cache[id]) {
              setImageSrc(objectURL);
              addToCache(Number(id), objectURL);
            }
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err?.message);
          } else {
            setError('An unknown error occurred while fetching the image.');
          }
        }
      };

      setError(null);
      if (!cache[id]) {
        fetchImage(false);
      }
      fetchImage(true);
    })();
  }, [addToCache, cache, id, photo]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pexels api doesn't provide title, description and the date when the photo was taken,
  // so we use id, alt and current date as a placeholder.
  return (
    <>
      <ScrollRestoration />
      <StyledDetailViewContainer>
        <StyledBackButton to={'/'}>Back to Grid</StyledBackButton>
        <StyledPhotoAndInfoWrapper>
          <StyledPhotoWrapper>
            {imageSrc ? (
              <StyledLargePhoto src={imageSrc} alt={photo?.alt || ''} />
            ) : (
              <StyledSkeletonForPhotoPage className="animate" $width={200} $height={300} />
            )}
          </StyledPhotoWrapper>
          <StyledPhotoInfo>
            {photo ? (
              <>
                <StyledTitle>Image #{photo?.id}</StyledTitle>
                {photo?.alt && <StyledDescription>{photo?.alt}</StyledDescription>}
                <p>
                  <strong>Date taken: </strong>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <a target="_blank" href={photo?.photographer_url}>
                  <strong>Photographer:</strong> {photo?.photographer}
                </a>
              </>
            ) : (
              <StyledSkeletonsWrapper>
                <Skeleton className="animate" $width={150} $height={36} />
                <Skeleton className="animate" $width={250} $height={24} />
                <Skeleton className="animate" $width={200} $height={24} />
                <Skeleton className="animate" $width={180} $height={24} />
              </StyledSkeletonsWrapper>
            )}
          </StyledPhotoInfo>
        </StyledPhotoAndInfoWrapper>
      </StyledDetailViewContainer>
    </>
  );
}
