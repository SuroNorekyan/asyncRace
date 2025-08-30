import { createSlice } from '@reduxjs/toolkit';
const initial = { byId: {}, global: 'idle', winner: null };
const slice = createSlice({
    name: 'race',
    initialState: initial,
    reducers: {
        setRun: (s, a) => {
            const prev = s.byId[a.payload.id] ?? { status: 'idle', progress: 0 };
            s.byId[a.payload.id] = { ...prev, ...a.payload.run };
        },
        setGlobal: (s, a) => {
            s.global = a.payload;
        },
        setWinner: (s, a) => {
            s.winner = a.payload;
        },
        resetAll: () => initial,
    },
});
export const { setRun, setGlobal, setWinner, resetAll } = slice.actions;
export default slice.reducer;
