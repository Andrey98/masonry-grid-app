import styled, { keyframes } from 'styled-components';
import type { SkeletonPropsType } from '.';

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const StyledSkeleton = styled.div<SkeletonPropsType>`
  background-color: #e0e0e0;
  border-radius: 8px;
  width: ${props => `${props.width || 100}px`};
  height: ${props => `${props.height || 100}px`};
  overflow: hidden;
  position: relative;

  &.animate::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.05) 10%,
      #f0f0f0 30%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 1.5s infinite linear;
  }
`;
