import { createGlobalStyle } from 'styled-components';
import { color, Theme } from './theme';

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  html, body, #__next {
    height: 100%;
  }

  body {
    font-family: Poppins, sans-serif;
    color: ${color('gray', 500)};
    background-color: ${color('dark', 300)};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root, #__next {
    isolation: isolate;
  }

  a {
    color: ${color('primary', 300)};
  }
`;
