import { createSlice } from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        data: {},

    },
    reducers: {
        store: (state, action) => {
            state.data = action.payload
        },
        get: (state, action) => {
            state.data = action.payload
        },
    },
})

export const { store, get } = eventsSlice.actions

export default eventsSlice.reducer