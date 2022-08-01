import * as React from 'react';
import {
  ChakraProvider, Box, Grid, theme, Heading, Button,
} from '@chakra-ui/react';
import ColorModeSwitcher from './ColorModeSwitcher';

export function Greeting(name: string): string {
  if (name.length < 1) {
    return 'Hello!';
  }

  return `Hello ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}!`;
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="50vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Heading fontSize="4xl">
            {Greeting('WORLD')}
          </Heading>
        </Grid>
        <Button size="lg" colorScheme="green">Start Coding</Button>
      </Box>
    </ChakraProvider>
  );
}
