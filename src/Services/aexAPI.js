import { Config } from '@/Config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const aexAPI = createApi({
  reducerPath: "aexApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Config.AEX_API_URL,
  }),
  endpoints: (builder) => ({
	  premisesearch: builder.query({
		  query: (arg) => (
			{
				url: '/premise-search',
				params: {...arg},
				method: 'GET'
			}
		  )
	  }),
	  areavalidation: builder.query({
		query: (arg) => {
			const { lat, lng } = arg;
			return {
				url: '/area-validate/'+lat+'/'+lng,
				method: 'GET'
			};
		}
	  }),
	  premiselookup: builder.query({
		query: (arg) => {
			const { premise_id } = arg;
			return {
				url: '/premise-lookup/'+premise_id,
				method: 'GET'
			};
		}
	  }),
	  premiseservices: builder.query({
		query: (arg) => {
			const { premise_id } = arg;
			return {
				url: '/premise-services/'+premise_id+'/services',
				params: {'status': 'Active,Pending ISP Application,Pending Installation,Pending ISP Activation,Activation in Progress,Expiring,Cancellation in Progress'},
				method: 'GET'
			};
		}
	  }),
	  productavailability: builder.query({
		query: (arg) => {
			const { lat, lng, provider } = arg;
			return {
				url: '/product-availability/'+lat+'/'+lng+'/',
				params: {'provider': provider},
				method: 'GET',
				timeout: 10000
			};
		}
	  }),
	  allpackages: builder.query({
		query: (arg) => (
		  {
			  url: 'https://www.zoomfibre.co.za/wp-content/plugins/zoomfiber_aex_api/cache/products.json',
			  method: 'GET'
		  }
		)
	}),
  })
});

export const {
  useLazyPremisesearchQuery,
  useLazyAreavalidationQuery,
  useLazyPremiselookupQuery,
  useLazyPremiseservicesQuery,
  useLazyAllpackagesQuery,
  useLazyProductavailabilityQuery,
} = aexAPI;