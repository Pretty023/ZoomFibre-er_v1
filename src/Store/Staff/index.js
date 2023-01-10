import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'staff',
  initialState: {id: null, email: null, givenName: null, familyName: null, photo: null, name: null, user_keep_logged_in: null },
  reducers: {
    setUser: (state, { payload: { id, email, givenName, familyName, photo, name, user_keep_logged_in } }) => {
        if (typeof id !== 'undefined') {
          state.id = id
        }
        if (typeof email !== 'undefined') {
          state.email = email
        }
      if (typeof givenName !== 'undefined') {
          state.givenName = givenName
        }
      if (typeof familyName !== 'undefined') {
          state.familyName = familyName
        }
      if (typeof photo !== 'undefined') {
          state.photo = photo
        }
      if (typeof name !== 'undefined') {
          state.name = name
        }
      
      if (typeof user_keep_logged_in !== 'undefined') {
          state.user_keep_logged_in = user_keep_logged_in
        }
    },
    clearUser: (state) => {
      state.id = null
      state.email = null
      state.givenName = null
      state.familyName = null
      state.photo= null
      state.name = 'Not Available'
      state.user_keep_logged_in = null
    },
    
  },
})

export const { setUser, clearUser } = slice.actions

export default slice.reducer