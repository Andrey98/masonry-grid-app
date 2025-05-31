global.TextDecoder = jest.fn();
global.TextEncoder = jest.fn();

import { render, screen } from '@testing-library/react';
import { VirtualMasonryGrid } from '.';
import * as contextModule from '../../providers/context';
import * as splitIntoColumnsModule from '../../utils/splitIntoColumns/splitIntoColumns';
import * as constantsModule from '../../constants';
import type { IPhoto } from '../../types';

jest.mock('../../providers/context');
jest.mock('../../utils/splitIntoColumns/splitIntoColumns');
jest.mock('../Photo', () => ({
  Photo: jest.fn(({ photo, willTriggerNextPageFetch }) => (
    <div data-testid={`photo-${photo.id}`} data-trigger-fetch={String(willTriggerNextPageFetch)}>
      {photo.alt}
    </div>
  )),
}));
jest.mock('./styles', () => ({
  StyledColumns: jest.fn(({ children, $gap }) => (
    <div data-testid="styled-columns" data-gap={$gap}>
      {children}
    </div>
  )),
  StyledColumn: jest.fn(({ children, $gap }) => (
    <div data-testid="styled-column" data-gap={$gap}>
      {children}
    </div>
  )),
}));
jest.mock('../../constants', () => ({
  GAP: 10,
}));

const mockUseStore = contextModule.useStore as jest.Mock;
const mockSplitIntoColumns = splitIntoColumnsModule.splitIntoColumns as jest.Mock;
const MockPhotoComponent = jest.requireMock('../Photo').Photo as jest.Mock;

const mockPhotos: IPhoto[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `Alt text ${i + 1}`,
  width: 100,
  height: 150,
  url: `url${i + 1}`,
  photographer: `P${i + 1}`,
  photographer_url: ``,
  src: { medium: `m${i + 1}`, original: `o${i + 1}` },
}));

describe('VirtualMasonryGrid', () => {
  beforeEach(() => {
    mockUseStore.mockClear();
    mockSplitIntoColumns.mockClear();
    MockPhotoComponent.mockClear();
    (jest.requireMock('./styles').StyledColumns as jest.Mock).mockClear();
    (jest.requireMock('./styles').StyledColumn as jest.Mock).mockClear();
  });

  it('renders correct number of columns and passes GAP prop', () => {
    const columnCount = 3;
    mockUseStore.mockReturnValue({ columnCount });
    const mockColumnsData = [
      [mockPhotos[0], mockPhotos[3]],
      [mockPhotos[1], mockPhotos[4]],
      [mockPhotos[2], mockPhotos[5]],
    ];
    mockSplitIntoColumns.mockReturnValue(mockColumnsData);

    render(<VirtualMasonryGrid photos={mockPhotos.slice(0, 6)} />);

    expect(mockSplitIntoColumns).toHaveBeenCalledWith(mockPhotos.slice(0, 6), columnCount);
    expect(screen.getByTestId('styled-columns')).toBeInTheDocument();
    expect(screen.getByTestId('styled-columns')).toHaveAttribute(
      'data-gap',
      String(constantsModule.GAP)
    );

    const renderedColumns = screen.getAllByTestId('styled-column');
    expect(renderedColumns).toHaveLength(columnCount);
    renderedColumns.forEach(col => {
      expect(col).toHaveAttribute('data-gap', String(constantsModule.GAP));
    });
  });

  it('renders Photo components with correct props, including willTriggerNextPageFetch', () => {
    const columnCount = 2;
    const currentPhotos = mockPhotos.slice(0, 12);
    mockUseStore.mockReturnValue({ columnCount });
    const mockColumnsData = [
      [mockPhotos[0], mockPhotos[3]],
      [mockPhotos[1], mockPhotos[4]],
      [mockPhotos[2], mockPhotos[5]],
      [mockPhotos[6], mockPhotos[7]],
      [mockPhotos[8], mockPhotos[9]],
      [mockPhotos[10], mockPhotos[11]],
    ];
    mockSplitIntoColumns.mockReturnValue(mockColumnsData);

    render(<VirtualMasonryGrid photos={currentPhotos} />);

    expect(MockPhotoComponent).toHaveBeenCalledTimes(currentPhotos.length);

    const photo1Args = MockPhotoComponent.mock.calls.find(call => call[0].photo.id === 1);
    expect(photo1Args[0].willTriggerNextPageFetch).toBe(false);

    const photo3Args = MockPhotoComponent.mock.calls.find(call => call[0].photo.id === 3);
    expect(photo3Args[0].willTriggerNextPageFetch).toBe(true);

    const photo12Args = MockPhotoComponent.mock.calls.find(call => call[0].photo.id === 12);
    expect(photo12Args[0].willTriggerNextPageFetch).toBe(false);
  });

  it('passes an empty array to splitIntoColumns if photos prop is empty', () => {
    const columnCount = 3;
    mockUseStore.mockReturnValue({ columnCount });
    mockSplitIntoColumns.mockReturnValue([[], [], []]);

    render(<VirtualMasonryGrid photos={[]} />);
    expect(mockSplitIntoColumns).toHaveBeenCalledWith([], columnCount);
    expect(screen.getAllByTestId('styled-column')).toHaveLength(3);
    expect(MockPhotoComponent).not.toHaveBeenCalled();
  });

  it('re-calculates columns when photos prop changes', () => {
    const columnCount = 2;
    mockUseStore.mockReturnValue({ columnCount });
    mockSplitIntoColumns.mockReturnValueOnce([[mockPhotos[0]], [mockPhotos[1]]]);

    const { rerender } = render(<VirtualMasonryGrid photos={mockPhotos.slice(0, 2)} />);
    expect(mockSplitIntoColumns).toHaveBeenCalledWith(mockPhotos.slice(0, 2), columnCount);

    const newPhotos = mockPhotos.slice(0, 4);
    mockSplitIntoColumns.mockReturnValueOnce([
      [newPhotos[0], newPhotos[2]],
      [newPhotos[1], newPhotos[3]],
    ]);
    rerender(<VirtualMasonryGrid photos={newPhotos} />);
    expect(mockSplitIntoColumns).toHaveBeenCalledWith(newPhotos, columnCount);
    expect(mockSplitIntoColumns).toHaveBeenCalledTimes(2);
  });

  it('re-calculates columns when columnCount from store changes', () => {
    mockUseStore.mockReturnValue({ columnCount: 2 });
    mockSplitIntoColumns.mockReturnValueOnce([[mockPhotos[0]], [mockPhotos[1]]]);

    const { rerender } = render(<VirtualMasonryGrid photos={mockPhotos.slice(0, 2)} />);
    expect(mockSplitIntoColumns).toHaveBeenCalledWith(mockPhotos.slice(0, 2), 2);

    mockUseStore.mockReturnValue({ columnCount: 1 });
    mockSplitIntoColumns.mockReturnValueOnce([[mockPhotos[0], mockPhotos[1]]]);
    rerender(<VirtualMasonryGrid photos={mockPhotos.slice(0, 2)} />);
    expect(mockSplitIntoColumns).toHaveBeenCalledWith(mockPhotos.slice(0, 2), 1);
    expect(mockSplitIntoColumns).toHaveBeenCalledTimes(2);
  });
});
