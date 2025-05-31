global.TextDecoder = jest.fn();
global.TextEncoder = jest.fn();

import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from '.';
import * as contextModule from '../../providers/context';
import type { IPhoto } from '../../types';

jest.mock('../../providers/context');
jest.mock('../../components/VirtualMasonryGrid', () => ({
  VirtualMasonryGrid: jest.fn(({ photos }: { photos: IPhoto[] }) => (
    <div data-testid="virtual-masonry-grid">
      {photos.map((photo, index) => (
        <div key={photo.id || `photo-${index}`}>{photo.alt || `Photo ${photo.id || index}`}</div>
      ))}
    </div>
  )),
}));

jest.mock('./styles', () => ({
  StyledMain: jest.fn(({ children, ...props }) => (
    <main data-testid="styled-main" {...props}>
      {children}
    </main>
  )),
  StyledHeader: jest.fn(({ children, ...props }) => (
    <header data-testid="styled-header" {...props}>
      {children}
    </header>
  )),
  StyledInput: jest.fn(props => <input data-testid="styled-input" {...props} />),
}));

const mockUseStore = contextModule.useStore as jest.Mock;
const mockSetSearch = jest.fn();

const mockPhotos: IPhoto[] = [
  {
    id: 1,
    alt: 'Photo 1',
    width: 100,
    height: 100,
    photographer: 'P1',
    photographer_url: '',
    src: {
      medium: 'm1',
      original: '',
    },
  },
  {
    id: 2,
    alt: 'Photo 2',
    width: 100,
    height: 100,
    photographer: 'P2',
    photographer_url: '',
    src: {
      medium: 'm2',
      original: '',
    },
  },
];

describe('Home Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSetSearch.mockClear();

    mockUseStore.mockReturnValue({
      photos: mockPhotos,
      search: '',
      setSearch: mockSetSearch,
      columnCount: 3,
      columnWidth: 300,
      cache: {},
      addToCache: jest.fn(),
      fetchNextPage: jest.fn(),
    });
    (
      jest.requireMock('../../components/VirtualMasonryGrid').VirtualMasonryGrid as jest.Mock
    ).mockClear();
    (jest.requireMock('./styles').StyledMain as jest.Mock).mockClear();
    (jest.requireMock('./styles').StyledHeader as jest.Mock).mockClear();
    (jest.requireMock('./styles').StyledInput as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders correctly with initial store values', () => {
    render(<Home />);
    expect(screen.getByTestId('styled-main')).toBeInTheDocument();

    expect(screen.getByTestId('styled-header')).toBeInTheDocument();
    expect(screen.getByTestId('styled-header')).toHaveTextContent('Masonry Grid');

    const input = screen.getByTestId('styled-input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('Search...');

    expect(screen.getByTestId('virtual-masonry-grid')).toBeInTheDocument();
    expect(
      jest.requireMock('../../components/VirtualMasonryGrid').VirtualMasonryGrid
    ).toHaveBeenCalledWith({ photos: mockPhotos }, undefined);
  });

  it('initializes input value from store search state', () => {
    mockUseStore.mockReturnValue({
      photos: [],
      search: 'initial search',
      setSearch: mockSetSearch,
    });
    render(<Home />);
    const input = screen.getByTestId('styled-input') as HTMLInputElement;
    expect(input.value).toBe('initial search');
  });

  it('updates inputValue on typing and debounces setSearch call', async () => {
    render(<Home />);
    const input = screen.getByTestId('styled-input') as HTMLInputElement;

    await waitFor(async () => {
      await userEvent.type(input, 'test query');
    });
    expect(input.value).toBe('test query');
    expect(mockSetSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(mockSetSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(mockSetSearch).toHaveBeenCalledWith('test query');
    expect(mockSetSearch).toHaveBeenCalledTimes(1);
  });

  it('clears previous timeout and sets a new one on rapid input changes', async () => {
    render(<Home />);
    const input = screen.getByTestId('styled-input') as HTMLInputElement;

    await waitFor(async () => {
      await userEvent.type(input, 'first');
    });
    expect(input.value).toBe('first');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(mockSetSearch).not.toHaveBeenCalled();

    await waitFor(async () => {
      await userEvent.type(input, ' second');
    });
    expect(input.value).toBe('first second');
    expect(mockSetSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(mockSetSearch).toHaveBeenCalledWith('first second');
    expect(mockSetSearch).toHaveBeenCalledTimes(1);
  });

  it('calls setSearch with empty string if input is cleared after debouncing', async () => {
    mockUseStore.mockReturnValue({
      photos: [],
      search: 'initial',
      setSearch: mockSetSearch,
    });
    render(<Home />);
    const input = screen.getByTestId('styled-input') as HTMLInputElement;
    expect(input.value).toBe('initial');

    await waitFor(async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'new');
    });
    expect(input.value).toBe('new');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(mockSetSearch).toHaveBeenCalledWith('new');
    expect(mockSetSearch).toHaveBeenCalledTimes(1);
    mockSetSearch.mockClear();

    await waitFor(async () => {
      await userEvent.clear(input);
    });
    expect(input.value).toBe('');
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(mockSetSearch).toHaveBeenCalledWith('');
    expect(mockSetSearch).toHaveBeenCalledTimes(1);
  });
});
