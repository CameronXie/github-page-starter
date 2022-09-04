// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import { GitHub } from '../../src/services/GitHub';

const mockedOctokit = {
  graphql: jest.fn(),
  request: jest.fn(),
};

jest.mock('@octokit/core', () => ({
  Octokit: jest.fn().mockImplementation(() => mockedOctokit),
}));

describe('GitHub tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user', async () => {
    mockedOctokit.graphql
      .mockResolvedValueOnce({
        viewer: {
          login: 'user',
          name: 'user_name',
          avatarUrl: 'user_avatar',
        },
      } as never)
      .mockResolvedValueOnce({
        viewer: {
          login: 'user',
          name: undefined,
          avatarUrl: 'user_avatar',
        },
      } as never);
    const client = new GitHub('token');

    expect(await client.getUser()).toEqual({
      login: 'user',
      name: 'user_name',
      avatar: 'user_avatar',
    });

    expect(await client.getUser()).toEqual({
      login: 'user',
      name: null,
      avatar: 'user_avatar',
    });
  });

  it('should return file', async () => {
    mockedOctokit.request.mockResolvedValue({
      data: {
        type: 'file',
        content: Buffer.from('content').toString('base64'),
        encoding: 'base64',
        sha: 'sha',
      },
    } as never);
    const client = new GitHub('token');

    expect(await client.getFile('owner', 'repo', 'path')).toEqual({
      owner: 'owner',
      repo: 'repo',
      path: 'path',
      content: 'content',
      sha: 'sha',
    });
  });

  it.each([
    ['raw content', new Error('unsupported response structure')],
    [
      {
        data: {
          type: 'dir',
          content: '',
          encoding: 'base64',
          sha: 'sha',
        },
      },
      new Error('path is not a valid file'),
    ],
    [
      {
        data: {
          type: 'file',
          content: '',
          encoding: 'random',
          sha: 'sha',
        },
      },
      new Error('unsupported encoding random'),
    ],
  ])(
    'should throw error if invalid response',
    (file: unknown, expectedErr: Error) => {
      mockedOctokit.request.mockResolvedValue(file as never);

      new GitHub('token').getFile('owner', 'repo', 'path').catch((err) => {
        expect(err).toEqual(expectedErr);
      });
    },
  );

  it('should update file content', async () => {
    mockedOctokit.request.mockResolvedValue({ status: 200 } as never);
    const client = new GitHub('token');

    expect(
      await client.updateFileContent({
        owner: 'owner',
        repo: 'repo',
        path: 'path',
        content: 'content',
        sha: 'sha',
        message: 'message',
      }),
    ).toEqual(200);

    expect(mockedOctokit.request).toBeCalledTimes(1);
    expect(mockedOctokit.request).toHaveBeenLastCalledWith(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'owner',
        repo: 'repo',
        path: 'path',
        content: Buffer.from('content').toString('base64'),
        sha: 'sha',
        message: 'message',
      },
    );
  });
});
