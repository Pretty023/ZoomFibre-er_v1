import AsyncStorage from '@react-native-async-storage/async-storage'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import { api } from '@/Services/api'
import { resellerAPI } from '@/Services/resellerAPI'
import { aexAPI } from '@/Services/aexAPI'
import theme from './Theme'
import reseller from './Reseller'
import staff from './Staff'

const reducers = combineReducers({
  theme,
  reseller,
  staff,
  api: api.reducer,
  [resellerAPI.reducerPath]: resellerAPI.reducer,
  [aexAPI.reducerPath]: aexAPI.reducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'reseller', 'staff'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 240
      },
      immutableCheck: false,
    }).concat([api.middleware, resellerAPI.middleware, aexAPI.middleware])

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    }

    return middlewares
  },
})

const persistor = persistStore(store)

setupListeners(store.dispatch)

export { store, persistor }
