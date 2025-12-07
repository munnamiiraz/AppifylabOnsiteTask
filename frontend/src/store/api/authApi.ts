import { baseApi } from './baseApi';
import type { AuthResponse, LoginRequest, RegisterRequest, ApiAuthResponse } from "../../types/user.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiAuthResponse): AuthResponse => {
        return {
          user: response.data.user,
          token: response.data.token,
        };
      },
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (err) {
          console.error('Sign-in failed:', err);
        }
      },
    }),
    signUp: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: ApiAuthResponse): AuthResponse => {
        return {
          user: response.data.user,
          token: response.data.token,
        };
      },
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (err) {
          console.error('Sign-up failed:', err);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('token');
        } catch (err) {
          console.error('Logout failed:', err);
        }
      },
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation, useLogoutMutation } = authApi;