import { Octokit } from '@octokit/core';
import { User as GitHubUser } from '@octokit/graphql-schema';

export type User = {
  login: string;
  name: string | null;
  avatar: string;
};

export type File = {
  owner: string;
  repo: string;
  path: string;
  content: string;
  sha: string;
};

export type UpdateFileRequest = {
  message: string;
} & File;

export class GitHub {
  protected readonly client: Octokit;

  constructor(token: string) {
    this.client = new Octokit({ auth: token });
  }

  public async getUser(): Promise<User> {
    const { viewer } = await this.client.graphql<{
      viewer: GitHubUser;
    }>(/* GraphQL */ `
      query viewer {
        viewer {
          login
          name
          avatarUrl
        }
      }
    `);

    return {
      name: viewer.name || null,
      avatar: viewer.avatarUrl as string,
      login: viewer.login,
    };
  }

  public async getFile(
    owner: string,
    repo: string,
    path: string,
  ): Promise<File> {
    const { data } = await this.client.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
      },
    );

    if (
      typeof data !== 'object' ||
      !('type' in data) ||
      !('content' in data) ||
      !('encoding' in data) ||
      !('sha' in data)
    ) {
      throw new Error('unsupported response structure');
    }

    const { type, content, encoding, sha } = data;

    if (type !== 'file') {
      throw new Error(`${path} is not a valid file`);
    }

    if (encoding !== 'base64') {
      throw new Error(`unsupported encoding ${encoding}`);
    }

    return {
      owner,
      repo,
      path,
      content: Buffer.from(content, 'base64').toString('utf-8'),
      sha,
    };
  }

  public async updateFileContent({
    owner,
    repo,
    path,
    content,
    sha,
    message,
  }: UpdateFileRequest): Promise<number> {
    const { status } = await this.client.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
        message,
        sha,
        content: Buffer.from(content).toString('base64'),
      },
    );

    return status;
  }
}
