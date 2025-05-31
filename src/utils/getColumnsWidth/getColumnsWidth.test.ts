import { getColumnsWidth } from './getColumnsWidth';
import * as getColumnsCountModule from '../getColumnsCount/getColumnsCount';
import * as constantsModule from '../../constants';

jest.mock('../getColumnsCount/getColumnsCount');
jest.mock('../../constants');

describe('getColumnsWidth', () => {
  const mockGetColumnsCount = getColumnsCountModule.getColumnsCount as jest.Mock;

  const mockWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  beforeEach(() => {
    (constantsModule.PADDING as number) = 10;
    (constantsModule.GAP as number) = 5;
  });

  it('should calculate column width correctly for 1 column', () => {
    mockGetColumnsCount.mockReturnValue(1);
    mockWindowWidth(100);
    (constantsModule.PADDING as number) = 10;
    expect(getColumnsWidth()).toBe(80);
  });

  it('should calculate column width correctly for 2 columns', () => {
    mockGetColumnsCount.mockReturnValue(2);
    mockWindowWidth(200);
    (constantsModule.PADDING as number) = 10;
    (constantsModule.GAP as number) = 5;
    expect(getColumnsWidth()).toBe(87.5);
  });

  it('should calculate column width correctly for 3 columns', () => {
    mockGetColumnsCount.mockReturnValue(3);
    mockWindowWidth(300);
    (constantsModule.PADDING as number) = 10;
    (constantsModule.GAP as number) = 5;
    expect(getColumnsWidth()).toBe(90);
  });

  it('should calculate column width correctly for 4 columns', () => {
    mockGetColumnsCount.mockReturnValue(4);
    mockWindowWidth(400);
    (constantsModule.PADDING as number) = 10;
    (constantsModule.GAP as number) = 5;
    expect(getColumnsWidth()).toBe(91.25);
  });

  it('should handle different PADDING and GAP values', () => {
    mockGetColumnsCount.mockReturnValue(2);
    mockWindowWidth(300);
    (constantsModule.PADDING as number) = 20;
    (constantsModule.GAP as number) = 10;
    expect(getColumnsWidth()).toBe(125);
  });

  it('should handle zero PADDING and GAP values', () => {
    mockGetColumnsCount.mockReturnValue(3);
    mockWindowWidth(300);
    (constantsModule.PADDING as number) = 0;
    (constantsModule.GAP as number) = 0;
    expect(getColumnsWidth()).toBe(100);
  });
});
