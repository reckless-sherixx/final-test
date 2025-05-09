import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/comments`,
    credentials: "include",
  }),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: (commentData) => ({
        url: '/post-comment',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),
    getComments: builder.query({
      query: () => ({
        url: '/total-comments',
        method: 'GET',

      }),
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/delete-comment/${id}`,
        method: 'DELETE',
      })
    }),
    getDeletedComments: builder.query({
      query: () => '/deleted-comments',
      transformResponse: (response) => response.deletedComments,
      providesTags: ['Comments']
    }),

    permanentDeleteComment: builder.mutation({
      query: (id) => ({
        url: `/permanent-delete/${id}`,
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      invalidatesTags: ['Comments']
    }),
  }),
})

export const {
  useGetCommentsQuery,
  useDeleteCommentMutation,
  usePostCommentMutation,
  useGetDeletedCommentsQuery,
  usePermanentDeleteCommentMutation
} = commentApi;

export default commentApi;
