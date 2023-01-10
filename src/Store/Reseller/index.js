import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'reseller',
  initialState: { reseller_id: null, reseller_username: null, reseller_password: null, reseller_first_name: null, reseller_last_name: null, reseller_email_address: null, reseller_company: null, reseller_user_group: null, reseller_keep_logged_in: null },
  reducers: {
    setReseller: (state, { payload: { reseller_id, reseller_username, reseller_password, reseller_first_name, reseller_last_name, reseller_email_address, reseller_company, reseller_user_group, reseller_keep_logged_in } }) => {
      if (typeof reseller_id !== 'undefined') {
        state.reseller_id = reseller_id
      }
      if (typeof reseller_username !== 'undefined') {
        state.reseller_username = reseller_username
      }
	  if (typeof reseller_password !== 'undefined') {
        state.reseller_password = reseller_password
      }
	  if (typeof reseller_first_name !== 'undefined') {
        state.reseller_first_name = reseller_first_name
      }
	  if (typeof reseller_last_name !== 'undefined') {
        state.reseller_last_name = reseller_last_name
      }
	  if (typeof reseller_email_address !== 'undefined') {
        state.reseller_email_address = reseller_email_address
      }
	  if (typeof reseller_company !== 'undefined') {
        state.reseller_company = reseller_company
      }
	  if (typeof reseller_user_group !== 'undefined') {
        state.reseller_user_group = reseller_user_group
      }
	  if (typeof reseller_keep_logged_in !== 'undefined') {
        state.reseller_keep_logged_in = reseller_keep_logged_in
      }
    },
	clearReseller: (state) => {
		state.reseller_id = null
		state.reseller_username = null
		state.reseller_password = null
		state.reseller_first_name = null
		state.reseller_last_name = null
		state.reseller_email_address = null
		state.reseller_company = null
		state.reseller_user_group = null
		state.reseller_keep_logged_in = null
	}
  },
})

export const { setReseller, clearReseller } = slice.actions

export default slice.reducer
