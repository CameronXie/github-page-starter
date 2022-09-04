import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthProvider';
import AuthRoute from './Auth';
import Login from './views/Login';
import Editor from './views/Editor';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider guestPath="/" authPath="/editor">
          <Routes>
            <Route index element={<Login />} />
            <Route element={<AuthRoute />}>
              <Route path="editor" element={<Editor />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}
