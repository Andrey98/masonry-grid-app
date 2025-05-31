import React, { useMemo } from 'react';
import { Photo } from '../Photo';
import { splitIntoColumns } from '../../utils/splitIntoColumns/splitIntoColumns';
import { useStore } from '../../providers/context';
import { GAP } from '../../constants';

import { type IPhoto } from '../../types';

import { StyledColumn, StyledColumns } from './styles';

type VirtualMasonryGridPropsType = {
  photos: IPhoto[];
};

export const VirtualMasonryGrid: React.FC<VirtualMasonryGridPropsType> = ({ photos }) => {
  const { columnCount } = useStore();

  const columns = useMemo(() => {
    return splitIntoColumns<IPhoto>(photos, columnCount);
  }, [photos, columnCount]);

  return (
    <StyledColumns $gap={GAP}>
      {columns.map((col, i) => (
        <StyledColumn key={i} $gap={GAP}>
          {col.map((photo, j) => (
            <Photo
              key={photo.id}
              photo={photo}
              // This will trigger the next page fetch when the 10th last photo is visible
              willTriggerNextPageFetch={i + columnCount * j === photos.length - 10}
            />
          ))}
        </StyledColumn>
      ))}
    </StyledColumns>
  );
};
