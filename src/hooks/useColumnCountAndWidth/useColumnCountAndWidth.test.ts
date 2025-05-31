import { renderHook, act } from '@testing-library/react';
import { useColumnCountAndWidth } from './useColumnCountAndWidth';
import * as getColumnsCountModule from '../../utils/getColumnsCount/getColumnsCount';
import * as getColumnsWidthModule from '../../utils/getColumnsWidth/getColumnsWidth';

jest.mock('../../utils/getColumnsCount/getColumnsCount');
jest.mock('../../utils/getColumnsWidth/getColumnsWidth');

const mockGetColumnsCount = getColumnsCountModule.getColumnsCount as jest.Mock;
const mockGetColumnsWidth = getColumnsWidthModule.getColumnsWidth as jest.Mock;

describe('useColumnCountAndWidth', () => {
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;
  let resizeCallback: (() => void) | undefined;

  beforeEach(() => {
    mockAddEventListener = jest.fn((event, cb) => {
      if (event === 'resize') {
        resizeCallback = cb as () => void;
      }
    });
    mockRemoveEventListener = jest.fn();
    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      configurable: true,
      value: mockAddEventListener,
    });
    Object.defineProperty(window, 'removeEventListener', {
      writable: true,
      configurable: true,
      value: mockRemoveEventListener,
    });

    mockGetColumnsCount.mockReturnValue(3);
    mockGetColumnsWidth.mockReturnValue(300);
    jest.useFakeTimers();
  });

  afterEach(() => {
    mockGetColumnsCount.mockClear();
    mockGetColumnsWidth.mockClear();
    resizeCallback = undefined;
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should initialize with values from getColumnsCount and getColumnsWidth', () => {
    const { result } = renderHook(() => useColumnCountAndWidth());
    expect(result.current.count).toBe(3);
    expect(result.current.width).toBe(300);
    expect(mockGetColumnsCount).toHaveBeenCalledTimes(1);
    expect(mockGetColumnsWidth).toHaveBeenCalledTimes(1);
  });

  it('should add resize event listener on mount', () => {
    renderHook(() => useColumnCountAndWidth());
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
  });

  it('should remove resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useColumnCountAndWidth());
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
  });

  it('should update data on resize event', () => {
    const { result } = renderHook(() => useColumnCountAndWidth());
    expect(resizeCallback).toBeDefined();

    act(() => {
      mockGetColumnsCount.mockReturnValue(2);
      mockGetColumnsWidth.mockReturnValue(450);
      if (resizeCallback) resizeCallback();
      expect(mockGetColumnsCount).toHaveBeenCalledTimes(2);
      expect(mockGetColumnsWidth).toHaveBeenCalledTimes(2);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.width).toBe(450);
    expect(mockGetColumnsCount).toHaveBeenCalledTimes(3);
    expect(mockGetColumnsWidth).toHaveBeenCalledTimes(3);
  });

  it('should debounce resize events and update with latest after cooldown', () => {
    const { result } = renderHook(() => useColumnCountAndWidth());
    expect(resizeCallback).toBeDefined();

    act(() => {
      mockGetColumnsCount.mockReturnValue(4);
      mockGetColumnsWidth.mockReturnValue(200);
      if (resizeCallback) resizeCallback();
    });

    expect(result.current.count).toBe(4);
    expect(result.current.width).toBe(200);

    act(() => {
      mockGetColumnsCount.mockReturnValue(1);
      mockGetColumnsWidth.mockReturnValue(800);
      if (resizeCallback) resizeCallback();
    });

    expect(result.current.count).toBe(4);
    expect(result.current.width).toBe(200);

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(result.current.count).toBe(4);
    expect(result.current.width).toBe(200);

    act(() => {
      mockGetColumnsCount.mockReturnValue(2);
      mockGetColumnsWidth.mockReturnValue(500);
      if (resizeCallback) resizeCallback();
    });

    expect(result.current.count).toBe(4);
    expect(result.current.width).toBe(200);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.width).toBe(500);

    expect(mockGetColumnsCount).toHaveBeenCalledTimes(5);
    expect(mockGetColumnsWidth).toHaveBeenCalledTimes(5);
  });

  it('should handle a single resize event after cooldown correctly', () => {
    const { result } = renderHook(() => useColumnCountAndWidth());
    expect(resizeCallback).toBeDefined();

    act(() => {
      mockGetColumnsCount.mockReturnValue(2);
      mockGetColumnsWidth.mockReturnValue(400);
      if (resizeCallback) resizeCallback();
      expect(mockGetColumnsCount).toHaveBeenCalledTimes(2);
      expect(mockGetColumnsWidth).toHaveBeenCalledTimes(2);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.width).toBe(400);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.width).toBe(400);
    expect(mockGetColumnsCount).toHaveBeenCalledTimes(3);
    expect(mockGetColumnsWidth).toHaveBeenCalledTimes(3);
  });

  it('should not update if no resize occurred during cooldown', () => {
    const { result } = renderHook(() => useColumnCountAndWidth());
    expect(resizeCallback).toBeDefined();

    act(() => {
      mockGetColumnsCount.mockReturnValue(1);
      mockGetColumnsWidth.mockReturnValue(600);
      if (resizeCallback) resizeCallback();
    });
    expect(result.current.count).toBe(1);
    expect(result.current.width).toBe(600);

    const initialCallCountForCount = mockGetColumnsCount.mock.calls.length;
    const initialCallCountForWidth = mockGetColumnsWidth.mock.calls.length;

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.count).toBe(1);
    expect(result.current.width).toBe(600);
    expect(mockGetColumnsCount).toHaveBeenCalledTimes(initialCallCountForCount);
    expect(mockGetColumnsWidth).toHaveBeenCalledTimes(initialCallCountForWidth);
  });
});
