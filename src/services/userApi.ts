// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/'
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
    listarRifas: builder.query({
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
    listarBoletos: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarBoletos',
          method: 'post',
          body: variables,// get no lleva body
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
    listarSegundosGanadores: builder.mutation({
      query: (variables) => {
        return {
          url: 'listarSegundosGanadores',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    buscarBoleto: builder.mutation({
      query: (variables) => {
        return {
          url: 'buscarBoleto',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),

    registrarPremioBoletos: builder.mutation({
      query: (variables) => {
        return {
          url: 'registrarPremioBoletos',
          method: 'post',
          body: variables,
          headers: { uid: "token" },
        }
      },
      //transformResponse: (response: any, meta, arg) => response.data,
    }),
    actualizarBoleto: builder.mutation({
      query: (variables) => {
        return {
          url: 'actualizarBoleto',
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
  useListarRifasQuery,
  useListarBoletosMutation,
  useBuscarRifaMutation,
  useListarSegundosGanadoresMutation,
  useBuscarBoletoMutation,
  useRegistrarPremioBoletosMutation,
  useActualizarBoletoMutation
} = userApi;