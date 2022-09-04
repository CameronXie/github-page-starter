import React, { PropsWithChildren } from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import ColorModeSwitcher from '../components/ColorModeSwitcher';
import { useAuth } from '../contexts/AuthProvider';

export type DefaultLayoutProps = {
  title: string;
};

export function AuthLayout({
  title,
  children,
}: PropsWithChildren<DefaultLayoutProps>) {
  const { user, logout } = useAuth();

  if (!user) {
    throw new Error('should only be used for authenticated view');
  }

  return (
    <Box alignItems="center">
      {/* Header */}
      <Flex
        as="header"
        pos="fixed"
        top="0"
        w="full"
        minH="60px"
        boxShadow="sm"
        zIndex="999"
        justify="center"
        css={{
          backdropFilter: 'saturate(180%) blur(5px)',
          backgroundColor: useColorModeValue(
            'rgba(255, 255, 255, 0.8)',
            'rgba(26, 32, 44, 0.8)',
          ),
        }}
      >
        <Container as={Flex} maxW="7xl" align="center">
          <Flex
            flex={{ base: 1, md: 'auto' }}
            justify={{ base: 'start', md: 'start' }}
          >
            <Heading
              as="h1"
              fontSize="xl"
              display={{ base: 'none', md: 'block' }}
            >
              <Text as="b">{title}</Text>
            </Heading>
          </Flex>
          <Flex alignItems="center">
            <HStack as="nav" spacing={4}>
              <ColorModeSwitcher justifySelf="flex-end" />
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar size="sm" src={user.avatar} />
                </MenuButton>
                <MenuList alignItems="center">
                  <br />
                  <Center>
                    <Avatar size="2xl" src={user.avatar} />
                  </Center>
                  <br />
                  <Center>
                    <p>{user.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Flex>
      <Container maxW="6xl" mt={20}>
        {/* Content */}
        <Flex h="calc(100vh - 80px)" direction="column">
          <Flex flexGrow={1} flexShrink={0} flexBasis="auto">
            <Box w="100%">{children}</Box>
          </Flex>

          {/* Footer */}
          <Flex flexShrink={0}>
            <Text>
              {`Project ©${new Date().getFullYear()}. All rights reserved`}
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
