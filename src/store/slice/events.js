import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: {},
    errors: {},
}

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        store: (state, action) => {
            state.data = action.payload
        },
        get: (state, action) => {
            state.data = action.payload
        },
        errors: (state, action) => {
            state.errors = action.payload
        }
    },
})

export const getEventsStore = state => state.events

export const { store, get, errors } = eventsSlice.actions

export default eventsSlice.reducer