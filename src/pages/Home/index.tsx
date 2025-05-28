import { VirtualMasonryGrid } from '../../components/VirtualMasonryGrid';
import { PADDING } from '../../constants';
import { useStore } from '../../providers/context';

import { StyledHeader, StyledMain } from './styles';

export default function Home() {
  const { photos } = useStore();

  return (
    <>
      <StyledMain $padding={PADDING}>
        <StyledHeader>Masonry Grid</StyledHeader>
        <VirtualMasonryGrid photos={photos} />
      </StyledMain>
    </>
  );
}
