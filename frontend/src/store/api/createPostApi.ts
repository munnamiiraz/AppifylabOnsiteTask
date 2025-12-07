import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const createPostApi = createApi({
  reducerPath: 'createPostApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    createPost: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/posts',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

export const { useCreatePostMutation } = createPostApi