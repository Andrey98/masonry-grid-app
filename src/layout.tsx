import Home from './pages/Home';
import { GlobalStyle } from './globalStyles';
import { createBrowserRouter, RouterProvider } from 'react-router';
import PhotoPage from './pages/PhotoPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/photo',
    element: <PhotoPage />,
  },
]);

export default function Layout() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}
