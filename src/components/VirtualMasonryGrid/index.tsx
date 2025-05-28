import React, { useMemo } from 'react';
import Photo from '../Photo';
import { splitIntoColumns } from '../../utils/splitIntoColumns';
import { useStore } from '../../providers/context';
import { GAP } from '../../constants';

import { type IPhoto } from '../../types';

import { StyledColumn, StyledColumns } from './styled';

type VirtualMasonryGridPropsType = {
  photos: IPhoto[];
};

export const VirtualMasonryGrid: React.FC<VirtualMasonryGridPropsType> = ({ photos }) => {
  const { columnCount } = useStore();

  const columns = useMemo(() => {
    return splitIntoColumns<IPhoto>(photos, columnCount);
  }, [photos, columnCount]);

  return (
    <StyledColumns gap={GAP}>
      {columns.map((col, i) => (
        <StyledColumn key={i} gap={GAP}>
          {col.map(photo => (
            <Photo key={photo.id} photo={photo} />
          ))}
        </StyledColumn>
      ))}
    </StyledColumns>
  );
};
