import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@styles/global-style';
import { theme } from '@styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
