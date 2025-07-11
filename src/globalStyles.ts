import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  #root {
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    width: 100%;
    margin: 0;
    text-align: center;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 100vw;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;
  }

  html {
    padding: 0;
  }

  * {
    margin: 0;
  }
`;
