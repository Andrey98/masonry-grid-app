import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { StoreProvider } from './providers/context.tsx';
import Home from './pages/Home';
import PhotoPage from './pages/PhotoPage';

import { GlobalStyle } from './globalStyles.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/photo/:id',
    loader: async ({ params }) => {
      return params;
    },
    element: <PhotoPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <GlobalStyle />
    <RouterProvider router={router} />
  </StoreProvider>
);
