import type { FC } from 'react';

import { StyledSkeleton } from './styles';

export type SkeletonPropsType = {
  $width?: number;
  $height?: number;
  className?: string;
};

export const Skeleton: FC<SkeletonPropsType> = ({ $width = 0, $height = 0, className = '' }) => (
  <StyledSkeleton className={className} $width={$width} $height={$height} />
);
