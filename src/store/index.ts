import { configureStore } from '@reduxjs/toolkit'
import appSliceReducer from './app.slice'

const store = configureStore({
  reducer: appSliceReducer,
  middleware: []
})

export default store
