import { BIG_SCREEN, MEDIUM_SCREEN, SMALL_SCREEN } from '../constants';

export const getColumnsCount = () => {
  const width = window.innerWidth;
  if (width > BIG_SCREEN) return 4;
  if (width > MEDIUM_SCREEN) return 3;
  if (width > SMALL_SCREEN) return 2;
  return 1;
};
