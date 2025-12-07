import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:9000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Company', 'Workspace', 'Note', 'History', 'Vote'],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
      invalidatesTags: ['Auth'],
    }),

    // Company
    createCompany: builder.mutation({
      query: (data) => ({ url: '/companies', method: 'POST', body: data }),
      invalidatesTags: ['Company'],
    }),
    getCompanies: builder.query({
      query: () => '/companies',
      providesTags: ['Company'],
      transformResponse: (response: any) => response.data,
    }),

    // Workspace
    createWorkspace: builder.mutation({
      query: (data) => ({ url: '/workspaces', method: 'POST', body: data }),
      invalidatesTags: ['Workspace'],
    }),
    getWorkspaces: builder.query({
      query: (companyId: string) => `/workspaces?companyId=${companyId}`,
      providesTags: ['Workspace'],
      transformResponse: (response: any) => response.data,
    }),

    // Notes
    createNote: builder.mutation({
      query: (data) => ({ url: '/notes', method: 'POST', body: data }),
      invalidatesTags: ['Note'],
    }),
    updateNote: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/notes/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Note', 'History'],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({ url: `/notes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Note'],
    }),
    getPrivateNotes: builder.query({
      query: ({ search = '', workspaceId = '' }) => `/notes/private?search=${search}&workspaceId=${workspaceId}`,
      providesTags: ['Note'],
      transformResponse: (response: any) => response.data,
    }),
    getPublicNotes: builder.query({
      query: ({ search = '', sort = 'new' }) => `/notes/public?search=${search}&sort=${sort}`,
      providesTags: ['Note'],
      transformResponse: (response: any) => response.data,
    }),
    getNote: builder.query({
      query: (id) => `/notes/${id}`,
      providesTags: ['Note'],
      transformResponse: (response: any) => response.data,
    }),

    // Vote
    vote: builder.mutation({
      query: (data) => ({ url: '/votes', method: 'POST', body: data }),
      invalidatesTags: ['Note'],
    }),

    // History
    getNoteHistory: builder.query({
      query: (noteId) => `/history/${noteId}`,
      providesTags: ['History'],
      transformResponse: (response: any) => response.data,
    }),
    restoreHistory: builder.mutation({
      query: (historyId) => ({ url: `/history/restore/${historyId}`, method: 'POST' }),
      invalidatesTags: ['Note', 'History'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useCreateWorkspaceMutation,
  useGetWorkspacesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetPrivateNotesQuery,
  useGetPublicNotesQuery,
  useGetNoteQuery,
  useVoteMutation,
  useGetNoteHistoryQuery,
  useRestoreHistoryMutation,
} = api;
