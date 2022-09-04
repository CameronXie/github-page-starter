import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { GitHub } from '../services/GitHub';

export type AuthProviderProps = {
  authPath: string;
  guestPath: string;
};

export type User = {
  name: string;
  avatar: string;
};

export interface AuthCtx {
  user: User | null;
  client: GitHub | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export function useAuth(): AuthCtx {
  return useContext(AuthContext);
}

function login(
  authPath: string,
  setUser: Dispatch<SetStateAction<User | null>>,
  setClient: Dispatch<SetStateAction<GitHub | null>>,
  navigate: NavigateFunction,
): (token: string) => Promise<void> {
  return async (token: string): Promise<void> => {
    const client = new GitHub(token);
    const { name, avatar, login: userLogin } = await client.getUser();
    setUser({ name: name || userLogin, avatar });
    setClient(client);
    navigate(authPath);
  };
}

function logout(
  guestPath: string,
  setUser: Dispatch<SetStateAction<User | null>>,
  setClient: Dispatch<SetStateAction<GitHub | null>>,
  navigate: NavigateFunction,
): () => void {
  return () => {
    setUser(null);
    setClient(null);
    navigate(guestPath);
  };
}

export function AuthProvider({
  children,
  authPath,
  guestPath,
}: PropsWithChildren<AuthProviderProps>) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<GitHub | null>(null);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      client,
      login: login(authPath, setUser, setClient, navigate),
      logout: logout(guestPath, setUser, setClient, navigate),
    }),
    [user, client, authPath, guestPath, navigate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
