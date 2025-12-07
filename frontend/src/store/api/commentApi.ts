import { baseApi } from './baseApi';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ postId }) => `/user/posts/${postId}/comments`,
      providesTags: (_, __, { postId }) => [
        { type: 'Comments', id: postId }
      ],
    }),

    createComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/user/posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_, __, { postId }) => [
        { type: 'Comments', id: postId },
        'Posts'
      ],
    }),

    updateComment: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `/user/comments/${commentId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['Comments', 'Posts'],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/user/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments', 'Posts'],
    }),

    toggleCommentLike: builder.mutation({
      query: (commentId) => ({
        url: `/user/comments/${commentId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Comments', 'Posts'],
    }),

    getReplies: builder.query({
      query: (commentId) => `/user/comments/${commentId}/replies`,
      providesTags: (_, __, commentId) => [
        { type: 'Replies', id: commentId }
      ],
    }),

    createReply: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `/user/comments/${commentId}/replies`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_, __, { commentId }) => [
        { type: 'Replies', id: commentId },
        'Comments',
        'Posts'
      ],
    }),

    updateReply: builder.mutation({
      query: ({ replyId, content }) => ({
        url: `/user/replies/${replyId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['Replies', 'Comments', 'Posts'],
    }),

    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/user/replies/${replyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Replies', 'Comments', 'Posts'],
    }),

    toggleReplyLike: builder.mutation({
      query: (replyId) => ({
        url: `/user/replies/${replyId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Replies', 'Comments', 'Posts'],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
  useGetRepliesQuery,
  useCreateReplyMutation,
  useUpdateReplyMutation,
  useDeleteReplyMutation,
  useToggleReplyLikeMutation,
} = commentApi;