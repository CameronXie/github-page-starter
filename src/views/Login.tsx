import React, { BaseSyntheticEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import ColorModeSwitcher from '../components/ColorModeSwitcher';
import { useAuth } from '../contexts/AuthProvider';

type FormData = {
  token: string;
};

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  async function signIn(data: FormData, e?: BaseSyntheticEvent): Promise<void> {
    if (e) {
      e.preventDefault();
    }
    try {
      await login(data.token);
    } catch (err: unknown) {
      setError('token', {
        type: 'auth',
        message: 'unable to authenticate, please try again',
      });
    }
  }

  function onSubmit(e: FormEvent) {
    handleSubmit(signIn)(e).catch(() => {
      // Error handle
    });
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Grid p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
      </Grid>
      <Flex minH="80vh" align="center" justify="center">
        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
          <Stack align="center">
            <Heading fontSize="4xl" textAlign="center">
              Sign in
            </Heading>
          </Stack>
          <Box
            rounded="lg"
            minW="sm"
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="lg"
            p={8}
          >
            <form onSubmit={onSubmit}>
              <Stack spacing={4}>
                <FormControl id="token" isInvalid={!!errors.token} isRequired>
                  <FormLabel>GitHub Token</FormLabel>
                  <Input
                    type="text"
                    {...register('token', {
                      required: 'GitHub token is required',
                      pattern: {
                        value: /gh[a-z]_[a-zA-Z0-9]+/g,
                        message: 'invalid GitHub token',
                      },
                    })}
                  />
                  {errors.token ? (
                    <FormErrorMessage>{errors.token?.message}</FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      We&apos;ll never store or share your GitHub token.
                    </FormHelperText>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  loadingText="Login"
                  size="lg"
                  bg="blue.400"
                  color="white"
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
}
