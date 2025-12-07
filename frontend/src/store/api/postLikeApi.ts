import { baseApi } from './baseApi';

export interface ToggleLikeResponse {
  success: boolean;
  liked: boolean;
  message: string;
}

export const postLikeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    togglePostLike: builder.mutation<ToggleLikeResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: '/user/:postId/react',
        method: 'POST',
        body: { postId },
      }),
      invalidatesTags: ['Posts'],
    }),
  }),
});

export const { useTogglePostLikeMutation } = postLikeApi;
