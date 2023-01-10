import { Config } from '@/Config'

export default build =>
  build.query({
    query: id => ({
		url: `/users/${id}`,
	})
  })
