import { createRoot } from 'react-dom/client';
import { StoreProvider } from './providers/context.tsx';
import Layout from './layout.tsx';

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <Layout />
  </StoreProvider>
);
