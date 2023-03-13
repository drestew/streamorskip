import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global-style';
import { theme } from '../styles/theme';

export default {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <GlobalStyle>
          <Story />
        </GlobalStyle>
      </ThemeProvider>
    ),
  ],
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
