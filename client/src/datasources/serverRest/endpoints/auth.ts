import { useAsync } from '@/modules/core/utils/useAsync';
import { serverRestClient } from '../serverRestClient';

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<void> => {
  const response = await serverRestClient.post<{ error?: { message: string } }>(
    '/auth/login',
    {
      body: JSON.stringify({ email, password }),
    },
  );

  if (response.error?.message) {
    throw Error(response.error?.message);
  }
};

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
}: SignUpInput): Promise<void> => {
  const response = await serverRestClient.post<{ error?: { message: string } }>(
    '/auth/signup',
    {
      body: JSON.stringify({ firstName, lastName, email, password }),
    },
  );

  if (response.error?.message) {
    throw Error(response.error?.message);
  }
};

export const logout = async (): Promise<void> => {
  return serverRestClient.post<void>('/auth/logout');
};

/////////////////////////////
// COMPOSABLES
/////////////////////////////

export const useLogin = () => useAsync(login, { defaultValue: null });
export const useSignup = () => useAsync(signup, { defaultValue: null });
export const useLogout = () => useAsync(logout, { defaultValue: null });
