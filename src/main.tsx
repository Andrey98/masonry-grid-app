import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { StoreProvider } from './providers/context.tsx';
import Home from './pages/Home';
import PhotoPage from './pages/PhotoPage';

import { GlobalStyle } from './globalStyles.ts';
import { ErrorBoundary } from './components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/photo/:id',
    element: <PhotoPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <StoreProvider>
      <GlobalStyle />
      <RouterProvider router={router} />
    </StoreProvider>
  </ErrorBoundary>
);
