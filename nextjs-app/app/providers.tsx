'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { useState, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

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
    <I18nextProvider i18n={i18n}>
      <SessionProvider>
        <SWRConfig value={swrConfig}>
          {children}
        </SWRConfig>
      </SessionProvider>
    </I18nextProvider>
  );
}
