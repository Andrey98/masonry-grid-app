global.TextDecoder = jest.fn();
global.TextEncoder = jest.fn();

import { createRef, RefObject } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Photo } from '.';
import * as useStoreModule from '../../providers/context';
import * as useVisibilityModule from '../../hooks/useVisibility/useVisibility';
import * as useImageHeightModule from '../../hooks/useImageHeight/useImageHeight';
import type { IPhoto, ICache } from '../../types';

jest.mock('../../providers/context');
jest.mock('../../hooks/useVisibility/useVisibility');
jest.mock('../../hooks/useImageHeight/useImageHeight');
jest.mock('../Skeleton', () => ({
  Skeleton: jest.fn(({ $width, $height, className }) => (
    <div
      data-testid="skeleton"
      data-width={$width}
      data-height={$height}
      className={className}
    ></div>
  )),
}));
jest.mock('./styles', () => ({
  StyledImageWrapper: jest.fn(({ children, $height, ref }) => (
    <div data-testid="image-wrapper" style={{ height: $height }} ref={ref}>
      {children}
    </div>
  )),
  StyledImage: jest.fn(({ src, alt }) => <img data-testid="styled-image" src={src} alt={alt} />),
}));

const mockUseStore = useStoreModule.useStore as jest.Mock;
const mockUseVisibility = useVisibilityModule.useVisibility as jest.Mock;
const mockUseImageHeight = useImageHeightModule.useImageHeight as jest.Mock;

let mockCache: ICache = {};
const mockAddToCache = jest.fn((id: number, blob: string, isOriginal: boolean) => {
  mockCache[id] = { blob, isOriginalSize: isOriginal };
});
const mockFetchNextPage = jest.fn();
let originalURLCreateObjectURL: typeof URL.createObjectURL;

const defaultPhoto: IPhoto = {
  id: 1,
  alt: 'Default Alt',
  width: 600,
  height: 400,
  photographer: 'Default Photographer',
  src: { medium: 'medium.jpg', original: 'original.jpg' },
  photographer_url: '',
};
const mockBlob = new Blob(['image data'], { type: 'image/jpeg' });
const mockObjectURL = 'blob:http://localhost/mock-url';

describe('Photo Component', () => {
  let mockVisibilityRef: RefObject<HTMLDivElement>;

  beforeEach(() => {
    mockCache = {};
    mockVisibilityRef = createRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
    mockUseStore.mockReturnValue({
      cache: mockCache,
      addToCache: mockAddToCache,
      fetchNextPage: mockFetchNextPage,
    });
    mockUseVisibility.mockReturnValue([mockVisibilityRef, false]);
    mockUseImageHeight.mockReturnValue({ height: 200, width: 300 });

    global.fetch = jest.fn();
    originalURLCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => mockObjectURL);

    mockAddToCache.mockClear();
    mockFetchNextPage.mockClear();
    (global.fetch as jest.Mock).mockClear();
    (URL.createObjectURL as jest.Mock).mockClear();
    (jest.requireMock('../Skeleton').Skeleton as jest.Mock).mockClear();
  });

  afterEach(() => {
    URL.createObjectURL = originalURLCreateObjectURL;
    jest.clearAllMocks();
  });

  const renderWithRouter = (photo: IPhoto, willTriggerNextPageFetch = false) => {
    return render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<Photo photo={photo} willTriggerNextPageFetch={willTriggerNextPageFetch} />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders Skeleton when not visible and not cached', () => {
    renderWithRouter(defaultPhoto);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-width', '300');
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-height', '200');
    expect(screen.queryByTestId('styled-image')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches and displays image when visible and not cached', async () => {
    mockUseVisibility.mockReturnValue([mockVisibilityRef, true]);
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, blob: async () => mockBlob } as Response)
      .mockResolvedValueOnce({ ok: true, blob: async () => mockBlob } as Response);

    renderWithRouter(defaultPhoto);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(defaultPhoto.src.medium);
      expect(global.fetch).toHaveBeenCalledWith(defaultPhoto.src.original);
      expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
      expect(mockAddToCache).toHaveBeenCalledWith(defaultPhoto.id, mockObjectURL, false);
      expect(mockAddToCache).toHaveBeenCalledWith(defaultPhoto.id, mockObjectURL, true);
      expect(screen.getByTestId('styled-image')).toHaveAttribute('src', mockObjectURL);
    });
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('uses cached medium image and fetches original if visible and medium cached', async () => {
    mockCache[defaultPhoto.id] = { blob: 'cached-medium.jpg', isOriginalSize: false };
    mockUseStore.mockReturnValue({
      cache: mockCache,
      addToCache: mockAddToCache,
      fetchNextPage: mockFetchNextPage,
    });
    mockUseVisibility.mockReturnValue([mockVisibilityRef, true]);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    renderWithRouter(defaultPhoto);

    await waitFor(() => {
      expect(screen.getByTestId('styled-image')).toHaveAttribute('src', 'cached-medium.jpg');
    });
  });

  it('uses fully cached original image if visible and original cached', async () => {
    mockCache[defaultPhoto.id] = { blob: 'cached-original.jpg', isOriginalSize: true };
    mockUseStore.mockReturnValue({
      cache: mockCache,
      addToCache: mockAddToCache,
      fetchNextPage: mockFetchNextPage,
    });
    mockUseVisibility.mockReturnValue([mockVisibilityRef, true]);

    renderWithRouter(defaultPhoto);

    await waitFor(() => {
      expect(screen.getByTestId('styled-image')).toHaveAttribute('src', 'cached-original.jpg');
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockAddToCache).not.toHaveBeenCalled();
  });

  it('calls fetchNextPage when visible and willTriggerNextPageFetch is true', () => {
    mockUseVisibility.mockReturnValue([mockVisibilityRef, true]);
    renderWithRouter(defaultPhoto, true);
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchNextPage when not visible, even if willTriggerNextPageFetch is true', () => {
    mockUseVisibility.mockReturnValue([mockVisibilityRef, false]);
    renderWithRouter(defaultPhoto, true);
    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it('displays error message if image fetch fails and not in cache', async () => {
    mockUseVisibility.mockReturnValue([mockVisibilityRef, true]);
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderWithRouter(defaultPhoto);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('styled-image')).not.toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });
});
