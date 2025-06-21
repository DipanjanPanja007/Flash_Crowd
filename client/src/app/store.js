import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth.slice.js'
import eventReducer from '../features/event.slice.js'

export const store = configureStore({
    reducer: {
        eventReducer,
        authReducer
    },
})