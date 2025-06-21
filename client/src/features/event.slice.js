// src/features/event.slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    events: [],
};

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.events.push({
                id: Date.now(),
                title: action.payload.title,
                description: action.payload.description,
                position: action.payload.position,
                type: action.payload.type || "default", // NEW FIELD
            });
        },
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        clearEvents: (state) => {
            state.events = [];
        },
    },
});

export const { addEvent, setEvents, clearEvents } = eventSlice.actions;
export default eventSlice.reducer;
