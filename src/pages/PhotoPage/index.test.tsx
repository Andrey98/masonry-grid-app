global.TextDecoder = jest.fn();
global.TextEncoder = jest.fn();

import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, RouteObject } from 'react-router';
import { PhotoPage } from './index';
import * as contextModule from '../../providers/context';
import type { IPhoto, ICache } from '../../types';

jest.mock('../../providers/context');
jest.mock('../../constants', () => ({
  API_KEY: 'test-api-key',
  PER_PAGE: 20,
  ROOT_MARGIN: '200px',
  BIG_SCREEN: 1200,
  MEDIUM_SCREEN: 900,
  SMALL_SCREEN: 600,
  GAP: 10,
  PADDING: 10,
}));

const mockUseStore = contextModule.useStore as jest.Mock;
let mockCache: ICache = {};
const mockAddToCache = jest.fn((key: number, blob: string, isOriginalSize: boolean) => {
  mockCache[key] = { blob, isOriginalSize };
});
let originalFetch: typeof global.fetch;
let originalURLCreateObjectURL: typeof URL.createObjectURL;

const mockPhotoData: IPhoto = {
  id: 123,
  width: 1000,
  height: 600,
  photographer: 'Test Photographer',
  photographer_url: 'photographer_url',
  src: {
    original: 'original_image_url_123.jpg',
    medium: 'medium_image_url_123.jpg',
  },
  alt: 'Test Alt Text',
};

const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
const mockObjectURL = 'blob:http://localhost/mock-object-url';

const testRoutes: RouteObject[] = [
  {
    path: '/photo/:id',
    element: <PhotoPage />,
  },
  {
    path: '/photo',
    element: <PhotoPage />,
  },
  {
    path: '/',
    element: <div>Mock Home Page</div>,
  },
];

const renderPhotoPageWithDataProvider = (photoId?: string | number) => {
  const initialEntries = photoId ? [`/photo/${photoId}`] : ['/photo'];
  const router = createMemoryRouter(testRoutes, {
    initialEntries: initialEntries,
  });
  return render(<RouterProvider router={router} />);
};

describe('PhotoPage', () => {
  beforeEach(() => {
    mockCache = {};
    mockUseStore.mockReturnValue({
      cache: mockCache,
      addToCache: mockAddToCache,
      columnCount: 3,
      columnWidth: 300,
      photos: [],
      search: '',
      setSearch: jest.fn(),
      fetchNextPage: jest.fn(),
    });

    originalFetch = global.fetch;
    global.fetch = jest.fn();

    originalURLCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => mockObjectURL);

    mockAddToCache.mockClear();
    (URL.createObjectURL as jest.Mock).mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    URL.createObjectURL = originalURLCreateObjectURL;
    jest.clearAllMocks();
  });

  it('shows an error if no ID is provided in the URL', () => {
    renderPhotoPageWithDataProvider();
    expect(screen.getByText('Error: Photo ID is required')).toBeInTheDocument();
  });

  it('shows skeleton loaders initially then photo details and image', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotoData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      } as Response);

    renderPhotoPageWithDataProvider(mockPhotoData.id);

    await waitFor(() => {
      expect(screen.getByText(`Image #${mockPhotoData.id}`)).toBeInTheDocument();
    });
    expect(screen.getByText(mockPhotoData.alt!)).toBeInTheDocument();
    expect(screen.getByText(mockPhotoData.photographer!)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pexels.com/v1/photos/${mockPhotoData.id}`,
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(mockPhotoData.src.medium);
    expect(global.fetch).toHaveBeenCalledWith(mockPhotoData.src.original);
    expect(mockAddToCache).toHaveBeenCalledWith(mockPhotoData.id, mockObjectURL, false);
    expect(mockAddToCache).toHaveBeenCalledWith(mockPhotoData.id, mockObjectURL, true);
  });

  it('fetches photo details and then uses cached medium image if available', async () => {
    mockCache[mockPhotoData.id] = { blob: 'cached_medium_blob_url', isOriginalSize: false };
    mockUseStore.mockReturnValue({
      cache: mockCache,
      addToCache: mockAddToCache,
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotoData,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      } as Response);

    renderPhotoPageWithDataProvider(mockPhotoData.id);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: mockPhotoData.alt })).toHaveAttribute(
        'src',
        'cached_medium_blob_url'
      );
    });
    await waitFor(() => {
      expect(screen.getByRole('img', { name: mockPhotoData.alt })).toHaveAttribute(
        'src',
        mockObjectURL
      );
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pexels.com/v1/photos/${mockPhotoData.id}`,
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(mockPhotoData.src.original);
    expect(global.fetch).not.toHaveBeenCalledWith(mockPhotoData.src.medium);
    expect(mockAddToCache).toHaveBeenCalledWith(mockPhotoData.id, mockObjectURL, true);
  });

  it('uses fully cached original image if available', async () => {
    mockCache[mockPhotoData.id] = { blob: 'cached_original_blob_url', isOriginalSize: true };
    mockUseStore.mockReturnValue({
      cache: mockCache,
      addToCache: mockAddToCache,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotoData,
    } as Response);

    renderPhotoPageWithDataProvider(mockPhotoData.id);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: mockPhotoData.alt })).toHaveAttribute(
        'src',
        'cached_original_blob_url'
      );
    });
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pexels.com/v1/photos/${mockPhotoData.id}`,
      expect.any(Object)
    );
    expect(global.fetch).not.toHaveBeenCalledWith(mockPhotoData.src.medium);
    expect(global.fetch).not.toHaveBeenCalledWith(mockPhotoData.src.original);
    expect(mockAddToCache).not.toHaveBeenCalled();
  });

  it('handles error when fetching photo details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    renderPhotoPageWithDataProvider(789);
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch photo with ID 789')).toBeInTheDocument();
    });
  });

  it('handles error when fetching medium image and no cache', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotoData,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

    renderPhotoPageWithDataProvider(mockPhotoData.id);

    await waitFor(() => {
      expect(screen.getByText('Error: response.blob is not a function')).toBeInTheDocument();
    });
  });

  it('does not set error if image fetch fails but image is already in cache', async () => {
    mockCache[mockPhotoData.id] = { blob: 'cached_medium_blob_url', isOriginalSize: false };
    mockUseStore.mockReturnValue({ cache: mockCache, addToCache: mockAddToCache });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPhotoData,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

    renderPhotoPageWithDataProvider(mockPhotoData.id);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: mockPhotoData.alt })).toHaveAttribute(
        'src',
        'cached_medium_blob_url'
      );
    });
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  it('displays a back button linking to home', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhotoData,
    });
    renderPhotoPageWithDataProvider(123);
    await waitFor(() => expect(screen.getByText('Back to Grid')).toBeInTheDocument());
    expect(screen.getByText('Back to Grid')).toHaveAttribute('href', '/');
  });
});
