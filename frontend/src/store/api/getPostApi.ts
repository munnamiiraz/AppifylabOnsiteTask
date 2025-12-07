import { baseApi } from './baseApi';
import type { GetPostsResponse } from '../../types';

export const getPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, void>({
      query: () => ({
        url: '/user/get-posts',

        method: 'GET',
      }),
      providesTags: ['Posts'],
    }),
  }),
});

export const { useGetPostsQuery } = getPostApi;