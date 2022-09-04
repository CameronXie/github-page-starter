import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('app') as HTMLFormElement).render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme} />
    <App />
  </React.StrictMode>,
);
