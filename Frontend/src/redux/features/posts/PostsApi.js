// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const postApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:5000/api/',
        credentials: 'include'
     }),
     tagTypes: ['Posts'],
     endpoints:  (builder) => ({
        fetchPosts: builder.query({
            query: ({search='', category='', location=''}) =>  `/posts?search=${search}&category=${category}&location=${location}`,
            providesTags: ['Posts']

        }),
        fetchPostById: builder.query({
            query: (id) => `/posts/${id}`,
        }),
        fetchRelatedPosts: builder.query({
            query: (id) => `/posts/related/${id}`
        }),
        createPost: builder.mutation({
            query: (newPost) => ({
                url: `/posts/create-post`,
                method: "POST",
                body: newPost,
                credentials: "include",
            }),
            invalidatesTags: ['Posts'],

        }),
        updatePost: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/posts/update-post/${id}`,
                method: "PATCH",
                body: rest,
                credentials: "include",
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'Posts', id }],
        }),

        deletePost: builder.mutation({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'Posts', id }],
        }),

     })


})

  export const  {useFetchPostsQuery, useFetchPostByIdQuery, useFetchRelatedPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation } = postApi;


