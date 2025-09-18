//=============================================================================
// File: globalStyle.js
// Purpose: Remove the default style of the browser
// Created: 2025-04-18
// ==============================================================================

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body {
    height: 100%;
  }
`;
