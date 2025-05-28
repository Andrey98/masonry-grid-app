import type { FC } from 'react';
import './Skeleton.css';

type SkeletonPropsType = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Skeleton: FC<SkeletonPropsType> = ({ width = 0, height = 0, className = '' }) => (
  <div
    className={`skeleton-loader ${className}`}
    style={{
      width,
      height,
    }}
  />
);

export default Skeleton;
