import { VirtualMasonryGrid } from './components/VirtualMasonryGrid';
import { PADDING } from './constants';
import { useStore } from './providers/context';

export default function App() {
  const { photos } = useStore();

  return (
    <main
      style={{
        padding: PADDING,
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: 50, lineHeight: 1.1 }}>Masonry Grid</h1>
      <VirtualMasonryGrid photos={photos} />
    </main>
  );
}
