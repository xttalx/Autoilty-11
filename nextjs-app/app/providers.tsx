'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SWR configuration for data fetching
  const swrConfig = {
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <SWRConfig value={swrConfig}>
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
