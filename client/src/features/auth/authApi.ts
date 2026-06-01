import { api } from '../../app/api';
import type { User } from '../../types';

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface LoginRequest {
  login: string;
  password: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
