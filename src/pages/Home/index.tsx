import { useEffect, useRef, useState } from 'react';
import { VirtualMasonryGrid } from '../../components/VirtualMasonryGrid';
import { PADDING } from '../../constants';
import { useStore } from '../../providers/context';

import { StyledHeader, StyledInput, StyledMain } from './styles';

export const Home = () => {
  const { photos, search, setSearch } = useStore();
  const [inputValue, setInputValue] = useState(search);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSearch(inputValue);
    }, 500);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, setSearch]);

  return (
    <>
      <StyledMain $padding={PADDING}>
        <StyledHeader>Masonry Grid</StyledHeader>
        <StyledInput
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Search..."
        />
        <VirtualMasonryGrid photos={photos} />
      </StyledMain>
    </>
  );
};
