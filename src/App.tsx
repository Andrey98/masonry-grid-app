import { VirtualMasonryGrid } from './components/VirtualMasonryGrid/VirtualMasonryGrid';
import { PADDING } from './constants';
import { useStore } from './providers/context';
import { GlobalStyle, StyledHeader, StyledMain } from './styled';

export default function App() {
  const { photos } = useStore();

  return (
    <>
      <GlobalStyle />
      <StyledMain padding={PADDING}>
        <StyledHeader>Masonry Grid</StyledHeader>
        <VirtualMasonryGrid photos={photos} />
      </StyledMain>
    </>
  );
}
