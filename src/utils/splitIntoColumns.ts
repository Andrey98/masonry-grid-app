export const splitIntoColumns = <T>(items: T[], columnCount: number): T[][] => {
  const columns = Array.from({ length: columnCount }, () => [] as T[]);
  let index = 0;

  for (const item of items) {
    columns[index].push(item);
    index = (index + 1) % columnCount;
  }

  return columns;
};
