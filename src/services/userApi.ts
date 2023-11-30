// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/enventario'
  }),
  // keepUnusedDataFor: 3,
  endpoints: (builder) => ({
    registrarRifa: builder.mutation({
      query: (variables) => {
        return {
          url: '',
          method: 'post',
          body: variables,
          // headers: { uid: variables.name },
        }
      },
      transformResponse: (response: any, meta, arg) => response.data,
    }),

  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useRegistrarRifaMutation,
} = userApi;