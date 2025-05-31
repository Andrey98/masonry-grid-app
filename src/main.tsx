import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { PhotoPage } from './pages/PhotoPage';
import { AppLayout } from './pages/layout.tsx';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);
