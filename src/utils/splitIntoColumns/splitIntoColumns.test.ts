import { splitIntoColumns } from './splitIntoColumns';

describe('splitIntoColumns', () => {
  it('should return an array of empty arrays for the specified column count when items array is empty', () => {
    const items: unknown[] = [];
    const columnCount = 3;
    const expected: unknown[][] = [[], [], []];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should return an empty array if column count is 0 and items array is empty (due to Array.from({length:0}))', () => {
    const items: unknown[] = [];
    const columnCount = 0;
    const expected: unknown[][] = [];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute items into available columns, leaving some columns empty if items < columnCount', () => {
    const items = [1, 2];
    const columnCount = 3;
    const expected = [[1], [2], []];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute a single item into the first column if items = 1 and columnCount > 1', () => {
    const items = ['a'];
    const columnCount = 2;
    const expected = [['a'], []];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute one item per column if items.length === columnCount', () => {
    const items = [1, 2, 3];
    const columnCount = 3;
    const expected = [[1], [2], [3]];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute items evenly when items.length is a multiple of columnCount', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const columnCount = 3;
    const expected = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute items evenly with two columns', () => {
    const items = ['a', 'b', 'c', 'd'];
    const columnCount = 2;
    const expected = [
      ['a', 'c'],
      ['b', 'd'],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute items unevenly, with earlier columns getting more items if not perfectly divisible', () => {
    const items = [1, 2, 3, 4, 5, 6, 7];
    const columnCount = 3;
    const expected = [
      [1, 4, 7],
      [2, 5],
      [3, 6],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should handle another uneven distribution case', () => {
    const items = [1, 2, 3, 4, 5];
    const columnCount = 2;
    const expected = [
      [1, 3, 5],
      [2, 4],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should handle a case with more items and columns, unevenly', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const columnCount = 4;
    const expected = [
      [1, 5, 9],
      [2, 6, 10],
      [3, 7],
      [4, 8],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should put all items into a single column if columnCount is 1', () => {
    const items = [1, 2, 3, 4, 5];
    const columnCount = 1;
    const expected = [[1, 2, 3, 4, 5]];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should handle empty items with columnCount 1', () => {
    const items: string[] = [];
    const columnCount = 1;
    const expected: string[][] = [[]];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should work with an array of strings', () => {
    const items = ['apple', 'banana', 'cherry', 'date'];
    const columnCount = 2;
    const expected = [
      ['apple', 'cherry'],
      ['banana', 'date'],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should work with an array of objects', () => {
    const items = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ];
    const columnCount = 2;
    const expected = [
      [
        { id: 1, name: 'A' },
        { id: 3, name: 'C' },
      ],
      [{ id: 2, name: 'B' }],
    ];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should distribute one item per column and leave subsequent columns empty if columnCount > items.length', () => {
    const items = [{ val: 10 }, { val: 20 }];
    const columnCount = 4;
    const expected = [[{ val: 10 }], [{ val: 20 }], [], []];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });

  it('should throw an error if columnCount is 0 and items array is not empty', () => {
    const items = [1, 2, 3];
    const columnCount = 0;
    expect(() => splitIntoColumns(items, columnCount)).toThrow();
  });

  it('should throw an error if columnCount is negative and items array is not empty', () => {
    const items = [1, 2, 3];
    const columnCount = -2;
    expect(() => splitIntoColumns(items, columnCount)).toThrow();
  });

  it('should return an empty array if columnCount is negative and items array is empty', () => {
    const items: number[] = [];
    const columnCount = -2;
    const expected: number[][] = [];
    expect(splitIntoColumns(items, columnCount)).toEqual(expected);
  });
});
