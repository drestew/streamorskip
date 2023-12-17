import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@styles/global-style';
import { theme } from '@styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';
import Head from 'next/head';

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>());
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self' https://hcoxdhdqhkhtynyvbdpv.supabase.co;
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <GlobalStyle />
          <Head>
            <title>Stream or Skip</title>
            <link rel="preconnect" href="https://supabase.co" />
            <meta
              name="description"
              content="StreamOrSkip.com is a community of people who just want to find what to watch next on Netflix, as well as help others do the same."
            />
            <meta
              httpEquiv="Content-Security-Policy"
              content={contentSecurityPolicyHeaderValue}
            />
          </Head>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionContextProvider>
  );
}
