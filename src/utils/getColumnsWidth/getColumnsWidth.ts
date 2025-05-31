import { getColumnsCount } from '../getColumnsCount/getColumnsCount';
import { GAP, PADDING } from '../../constants';

export const getColumnsWidth = () => {
  const columnCount = getColumnsCount();
  const columnWidth = (window.innerWidth - 2 * PADDING - (columnCount - 1) * GAP) / columnCount;

  return columnWidth;
};
