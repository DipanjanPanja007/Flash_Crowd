import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    auth: null
}

export const authSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        setAuth: function (state, action) {
            state.auth = action.payload
        },
    },
})

export const { setAuth } = authSlice.actions

export default authSlice.reducer