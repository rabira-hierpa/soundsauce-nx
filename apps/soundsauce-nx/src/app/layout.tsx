import './global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

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
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
