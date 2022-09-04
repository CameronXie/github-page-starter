import React, {
  BaseSyntheticEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';
import {
  Editable,
  EditablePreview,
  EditableTextarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Input,
  Stack,
  Textarea,
  useColorModeValue,
  VStack,
  Collapse,
  Tooltip,
} from '@chakra-ui/react';
import { useForm, UseFormResetField, UseFormSetError } from 'react-hook-form';
import { AuthLayout } from '../layouts/Auth';
import { useAuth } from '../contexts/AuthProvider';
import PrimaryButton from '../components/PrimaryButton';
import { File, GitHub } from '../services/GitHub';

type LoadFileFormData = {
  path: string;
};

type CommitFileFormData = {
  message: string;
};

function loadFile(
  client: GitHub,
  setFile: Dispatch<SetStateAction<File | undefined>>,
  setError: UseFormSetError<LoadFileFormData>,
): (data: LoadFileFormData, e?: BaseSyntheticEvent) => Promise<void> {
  return async (
    { path }: LoadFileFormData,
    e?: BaseSyntheticEvent,
  ): Promise<void> => {
    if (e) {
      e.preventDefault();
    }

    const [owner, repo, ...pathAry] = path.split('/');

    try {
      setFile(await client.getFile(owner, repo, pathAry.join('/')));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('path', { type: 'validation', message: err.message });
        return;
      }

      setError('path', { type: 'validation', message: String(err) });
    }
  };
}

function commitFile(
  client: GitHub,
  setError: UseFormSetError<CommitFileFormData>,
  resetField: UseFormResetField<CommitFileFormData>,
  file: File,
): (data: CommitFileFormData, e?: BaseSyntheticEvent) => Promise<void> {
  return async (
    { message }: CommitFileFormData,
    e?: BaseSyntheticEvent,
  ): Promise<void> => {
    if (e) {
      e.preventDefault();
    }

    try {
      await client.updateFileContent({ ...file, message });
      resetField('message');
    } catch (err) {
      if (err instanceof Error) {
        setError('message', { type: 'validation', message: err.message });
        return;
      }

      setError('message', { type: 'validation', message: String(err) });
    }
  };
}

export default function Editor() {
  const { client } = useAuth();

  const {
    register: loadFileFormRegister,
    handleSubmit: handleLoadFileFormSubmit,
    setError: setLoadFileFormError,
    formState: { errors: loadFileFormErrors },
  } = useForm<LoadFileFormData>({
    mode: 'onChange',
  });

  const {
    register: commitFileFormRegister,
    handleSubmit: handleCommitFileFormSubmit,
    setError: setCommitFileFormError,
    resetField: resetCommitField,
    formState: { errors: commitFileFormErrors },
  } = useForm<CommitFileFormData>({
    mode: 'onChange',
  });

  const [file, setFile] = useState<File>();

  function onFileChange(content: string): void {
    if (!file) {
      return;
    }

    setFile({ ...file, content });
  }

  function onLoadFileSubmit(e: FormEvent) {
    if (!client) {
      throw new Error('unauthenticated user');
    }

    handleLoadFileFormSubmit(loadFile(client, setFile, setLoadFileFormError))(
      e,
    ).catch(() => {
      //
    });
  }

  function onCommitFileFormSubmit(e: FormEvent) {
    if (!file) {
      return;
    }

    if (!client) {
      throw new Error('unauthenticated user');
    }

    handleCommitFileFormSubmit(
      commitFile(client, setCommitFileFormError, resetCommitField, file),
    )(e).catch(() => {
      //
    });
  }

  return (
    <AuthLayout title="Editor">
      <form onSubmit={onLoadFileSubmit}>
        <Stack
          minWidth="max-content"
          alignItems="center"
          direction={{ base: 'column', md: 'row' }}
        >
          <FormControl
            id="path"
            isInvalid={!!loadFileFormErrors.path}
            isRequired
          >
            <Input
              placeholder="File Path"
              aria-label="File Path"
              {...loadFileFormRegister('path', {
                required: 'path is required',
                pattern: {
                  value: /^[\w-]+(?:\/[\w-]+){2,}\.[a-z]+$/g,
                  message:
                    'path should be {owner}/{repo}/{file_path}.{file_extension}',
                },
              })}
            />
          </FormControl>
          <PrimaryButton type="submit">Load File</PrimaryButton>
        </Stack>
        {loadFileFormErrors.path && (
          <Text size="sm" color="red.500">
            {loadFileFormErrors.path?.message}
          </Text>
        )}
      </form>
      <Collapse in={!!file} animateOpacity>
        <Editable
          size="lg"
          mt={4}
          value={file?.content}
          selectAllOnFocus={false}
          onChange={(content) => onFileChange(content)}
        >
          <Tooltip label="Click to edit">
            <EditablePreview
              p={2}
              _hover={{
                background: useColorModeValue('gray.100', 'gray.700'),
              }}
            />
          </Tooltip>
          <EditableTextarea h="60vh" p={2} />
        </Editable>
        <form onSubmit={onCommitFileFormSubmit}>
          <VStack mt={4} p={4} align="center">
            <FormControl
              id="message"
              maxW="3xl"
              isInvalid={!!commitFileFormErrors.message}
              isRequired
            >
              <FormLabel>Commit message</FormLabel>
              <Textarea
                aria-label="Commit message"
                {...commitFileFormRegister('message', {
                  required: 'message is required',
                })}
              />
              {commitFileFormErrors.message && (
                <FormErrorMessage>
                  {commitFileFormErrors.message?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <PrimaryButton type="submit">Commit changes</PrimaryButton>
          </VStack>
        </form>
      </Collapse>
    </AuthLayout>
  );
}
