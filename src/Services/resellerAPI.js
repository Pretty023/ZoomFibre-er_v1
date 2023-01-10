import { Config } from '@/Config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const resellerAPI = createApi({
  reducerPath: "resellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Config.RESELLER_API_URL
  }),
  endpoints: (builder) => ({
	  authenticate: builder.query({
		  query: (arg) => (
			{
				url: '/auth',
				params: {...arg},
				method: 'GET'
			}
		  )
	  })
  })
});

export const {
  useLazyAuthenticateQuery,
} = resellerAPI;