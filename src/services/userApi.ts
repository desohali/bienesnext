// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://yocreoquesipuedohacerlo.com/'
  }),
  // keepUnusedDataFor: 3,
  endpoints: (builder) => ({
    registrarRifa: builder.mutation({
      query: (variables) => {
        return {
          url: 'registrarRifa',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      transformResponse: (response: any, meta, arg) => response.data,
    }),
    listarRifa: builder.query({
      query: (variables) => {
        return {
          url: 'listarRifas',
          method: 'get',
          // body: variables,// get no lleva body
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    buscarRifa: builder.mutation({
      query: (variables) => {
        return {
          url: 'buscarRifa',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegistrarRifaMutation,
  useListarRifaQuery,
  useBuscarRifaMutation
} = userApi;