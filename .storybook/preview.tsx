import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@styles/global-style';
import { theme } from '@styles/theme';
import { StoryFn } from '@storybook/react';
import { Preview } from '@storybook/react';

const withThemeProvider = (Story: StoryFn) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withThemeProvider],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
