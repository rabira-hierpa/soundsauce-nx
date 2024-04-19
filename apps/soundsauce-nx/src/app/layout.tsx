import { Provider } from 'react-redux';
import './global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import StoreProvider from './GlobalRedux/StoreProvider';
import AppLayout from './app-layout';

export const metadata = {
  title: 'SoundsauceNx',
  description: 'Rebrand of PingPlot',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title key="title">{metadata.title}</title>
        <meta
          key="description"
          name="description"
          content={metadata.description}
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>
            <AppLayout>{children}</AppLayout>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
