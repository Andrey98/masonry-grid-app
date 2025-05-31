import { getColumnsCount } from './getColumnsCount';

describe('getColumnsCount', () => {
  const mockWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it('should return 4 when window width is greater than BIG_SCREEN', () => {
    mockWindowWidth(1300);
    expect(getColumnsCount()).toBe(4);
  });

  it('should return 4 when window width is exactly BIG_SCREEN + 1', () => {
    mockWindowWidth(1201);
    expect(getColumnsCount()).toBe(4);
  });

  it('should return 3 when window width is equal to BIG_SCREEN', () => {
    mockWindowWidth(1200);
    expect(getColumnsCount()).toBe(3);
  });

  it('should return 3 when window width is greater than MEDIUM_SCREEN but not BIG_SCREEN', () => {
    mockWindowWidth(1000);
    expect(getColumnsCount()).toBe(3);
  });

  it('should return 3 when window width is exactly MEDIUM_SCREEN + 1', () => {
    mockWindowWidth(901);
    expect(getColumnsCount()).toBe(3);
  });

  it('should return 2 when window width is equal to MEDIUM_SCREEN', () => {
    mockWindowWidth(800);
    expect(getColumnsCount()).toBe(2);
  });

  it('should return 2 when window width is greater than SMALL_SCREEN but not MEDIUM_SCREEN', () => {
    mockWindowWidth(700);
    expect(getColumnsCount()).toBe(2);
  });

  it('should return 2 when window width is exactly SMALL_SCREEN + 1', () => {
    mockWindowWidth(601);
    expect(getColumnsCount()).toBe(2);
  });

  it('should return 1 when window width is less than SMALL_SCREEN', () => {
    mockWindowWidth(500);
    expect(getColumnsCount()).toBe(1);
  });

  it('should return 1 when window width is very small (e.g., 320)', () => {
    mockWindowWidth(320);
    expect(getColumnsCount()).toBe(1);
  });
});
