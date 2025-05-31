import { Outlet } from 'react-router';
import { GlobalStyle } from '../globalStyles';
import { StoreProvider } from '../providers/context';

export const AppLayout = () => {
  return (
    <StoreProvider>
      <GlobalStyle />
      <Outlet />
    </StoreProvider>
  );
};
