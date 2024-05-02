import React from 'react';
import Header from './header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center py-2 md:py-10 sm:px-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
