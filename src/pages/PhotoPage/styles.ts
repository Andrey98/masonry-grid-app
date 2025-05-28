import { NavLink } from 'react-router';
import styled from 'styled-components';
import { StyledSkeleton } from '../../components/Skeleton/styles';

export const StyledDetailViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
`;

export const StyledBackButton = styled(NavLink)`
  align-self: flex-start;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
  text-decoration: none;

  &:hover {
    background-color: #0056b3;
  }
`;

export const StyledPhotoWrapper = styled.div`
  width: 100%;
  height: 80vh;
  max-width: 70vw;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 800px) {
    max-width: 100vw;
    margin-bottom: 0;
    height: auto;
  }
`;

export const StyledTitle = styled.h2`
  font-size: 24px;
`;

export const StyledLargePhoto = styled.img`
  height: 80vh;
  max-width: 70vw;
  width: auto;
  object-fit: contain;
  object-position: top;

  @media (max-width: 800px) {
    max-width: 90vw;
    width: 90vw;
    height: auto;
  }
`;

export const StyledPhotoInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  gap: 20px;
`;

export const StyledDescription = styled.p`
  font-size: 18px;
`;

export const StyledPhotoAndInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const StyledSkeletonForPhotoPage = styled(StyledSkeleton)`
  height: 80vh;
  width: 40vw;

  @media (max-width: 800px) {
    width: 90vw;
  }
`;

export const StyledSkeletonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
