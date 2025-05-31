import { renderHook } from '@testing-library/react';
import { useImageHeight } from './useImageHeight';
import { useStore } from '../../providers/context';
import type { IPhoto } from '../../types';

jest.mock('../../providers/context', () => ({
  useStore: jest.fn(),
}));

const mockUseStore = useStore as jest.Mock;

describe('useImageHeight', () => {
  const initialPhoto: IPhoto = {
    id: 1,
    width: 1000,
    height: 500,
    alt: '',
    photographer: '',
    photographer_url: '',
    src: {
      medium: '',
      original: '',
    },
  };

  beforeEach(() => {
    mockUseStore.mockReturnValue({ columnWidth: 200, columnCount: 3 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should calculate initial dimensions correctly', () => {
    const { result } = renderHook(() => useImageHeight(initialPhoto));
    expect(result.current.height).toBe(100);
    expect(result.current.width).toBe(200);
  });

  it('should recalculate dimensions when columnWidth changes', () => {
    const { result, rerender } = renderHook(() => useImageHeight(initialPhoto));

    mockUseStore.mockReturnValue({ columnWidth: 300, columnCount: 3 });
    rerender();

    expect(result.current.height).toBe(150);
    expect(result.current.width).toBe(300);
  });

  it('should recalculate dimensions when photo.width changes', () => {
    const { result, rerender } = renderHook(({ photo }) => useImageHeight(photo), {
      initialProps: { photo: initialPhoto },
    });

    const newPhoto: IPhoto = { ...initialPhoto, width: 800 };
    rerender({ photo: newPhoto });

    expect(result.current.height).toBe(125);
    expect(result.current.width).toBe(200);
  });

  it('should recalculate dimensions when photo.height changes', () => {
    const { result, rerender } = renderHook(({ photo }) => useImageHeight(photo), {
      initialProps: { photo: initialPhoto },
    });

    const newPhoto: IPhoto = { ...initialPhoto, height: 750 };
    rerender({ photo: newPhoto });

    expect(result.current.height).toBe(150);
    expect(result.current.width).toBe(200);
  });

  it('should recalculate dimensions when columnCount changes (effect re-runs)', () => {
    const { result, rerender } = renderHook(() => useImageHeight(initialPhoto));

    mockUseStore.mockReturnValue({ columnWidth: 200, columnCount: 2 });
    rerender();

    expect(result.current.height).toBe(100);
    expect(result.current.width).toBe(200);
  });
});
