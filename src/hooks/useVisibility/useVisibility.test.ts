import { renderHook, act } from '@testing-library/react';
import { useVisibility } from './useVisibility';
import * as constantsModule from '../../constants';

jest.mock('../../constants');

const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
let mockIntersectionObserverCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    mockIntersectionObserverCallback = callback;
    this.rootMargin = options?.rootMargin || '0px';
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold || 0];
  }

  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = jest.fn();
  takeRecords = jest.fn(() => []);
}

global.IntersectionObserver = MockIntersectionObserver;

const triggerIntersection = (isIntersecting: boolean, entryOverrides = {}) => {
  if (mockIntersectionObserverCallback) {
    const mockEntry = {
      isIntersecting,
      target: document.createElement('div'),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
      ...entryOverrides,
    } as IntersectionObserverEntry;
    act(() => {
      mockIntersectionObserverCallback!(
        [mockEntry],
        new MockIntersectionObserver(mockIntersectionObserverCallback!)
      );
    });
  }
};

describe('useVisibility', () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockIntersectionObserverCallback = null;
    (constantsModule.ROOT_MARGIN as string) = '0px 0px 0px 0px';
  });

  it('should initialize with visible as false by default', () => {
    const { result } = renderHook(() => useVisibility());
    const [, visible] = result.current;
    expect(visible).toBe(false);
  });

  it('should initialize with visible as true if isAlreadyInCache is true', () => {
    const { result } = renderHook(() => useVisibility(0, true));
    const [, visible] = result.current;
    expect(visible).toBe(true);
  });

  it('should set visible to true when element becomes intersecting', () => {
    const { result, rerender } = renderHook(() => useVisibility());
    triggerIntersection(true);
    rerender();
    expect(result.current[1]).toBe(true);
  });

  it('should set visible to false when element stops intersecting', () => {
    const { result, rerender } = renderHook(() => useVisibility(0, true));
    triggerIntersection(false);
    rerender();
    expect(result.current[1]).toBe(false);
  });

  it('should call observer.disconnect on unmount', () => {
    const { result, unmount, rerender } = renderHook(() => useVisibility());
    const [ref] = result.current;

    (ref as React.MutableRefObject<HTMLDivElement | null>).current = document.createElement('div');
    rerender();

    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should use the provided threshold and ROOT_MARGIN', () => {
    const customThreshold = 0.75;
    const customRootMargin = '-10px';
    (constantsModule.ROOT_MARGIN as string) = customRootMargin;

    let capturedOptions: IntersectionObserverInit | undefined;
    global.IntersectionObserver = jest.fn((cb, opts) => {
      mockIntersectionObserverCallback = cb;
      capturedOptions = opts;
      return new MockIntersectionObserver(cb, opts);
    });

    renderHook(() => useVisibility(customThreshold));

    expect(capturedOptions?.threshold).toBe(customThreshold);
    expect(capturedOptions?.rootMargin).toBe(customRootMargin);
  });

  it('should not change visibility if isAlreadyInCache is true and element remains intersecting', () => {
    const { result } = renderHook(() => useVisibility(0, true));
    const [ref] = result.current;

    (ref as React.MutableRefObject<HTMLDivElement | null>).current = document.createElement('div');
    renderHook(() => useVisibility(0, true), { initialProps: {} });

    triggerIntersection(true);
    expect(result.current[1]).toBe(true);
  });

  it('should update visibility correctly after multiple intersections', () => {
    const { result, rerender } = renderHook(() => useVisibility());

    triggerIntersection(true);
    rerender();
    expect(result.current[1]).toBe(true);

    triggerIntersection(false);
    rerender();
    expect(result.current[1]).toBe(false);

    triggerIntersection(true);
    rerender();
    expect(result.current[1]).toBe(true);
  });
});
