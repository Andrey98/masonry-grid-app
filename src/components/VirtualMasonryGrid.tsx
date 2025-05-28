import React, { useMemo } from 'react';
import Photo from './Photo';
import { splitIntoColumns } from '../utils/splitIntoColumns';
import { useStore } from '../providers/context';
import { GAP } from '../constants';

import { type IPhoto } from '../types';

type Props = {
  photos: IPhoto[];
};

export const VirtualMasonryGrid: React.FC<Props> = ({ photos }) => {
  const { columnCount } = useStore();

  const columns = useMemo(() => {
    return splitIntoColumns<IPhoto>(photos, columnCount);
  }, [photos, columnCount]);

  return (
    <div style={{ display: 'flex', gap: GAP }}>
      {columns.map((col, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: GAP,
          }}
        >
          {col.map(photo => (
            <Photo key={photo.id} photo={photo} />
          ))}
        </div>
      ))}
    </div>
  );
};
