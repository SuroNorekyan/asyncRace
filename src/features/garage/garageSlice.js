import { createSlice } from '@reduxjs/toolkit';
import { addCar, editCar, generateMany, loadCars, removeCar } from './thunks';
const initial = {
    items: [],
    total: 0,
    page: 1,
    limit: 7,
    selectedId: null,
    createForm: { name: '', color: '#ffffff' },
    editForm: { name: '', color: '#ffffff' },
    loading: false,
};
const slice = createSlice({
    name: 'garage',
    initialState: initial,
    reducers: {
        setPage: (s, a) => {
            s.page = a.payload;
        },
        setCreateForm: (s, a) => {
            s.createForm = a.payload;
        },
        setEditForm: (s, a) => {
            s.editForm = a.payload;
        },
        selectCar: (s, a) => {
            s.selectedId = a.payload;
            const found = s.items.find(c => c.id === a.payload);
            if (found)
                s.editForm = { name: found.name, color: found.color };
        },
        clearSelection: s => {
            s.selectedId = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadCars.pending, s => {
            s.loading = true;
        })
            .addCase(loadCars.fulfilled, (s, a) => {
            s.loading = false;
            s.items = a.payload.items;
            s.total = a.payload.total;
        })
            // handled elsewhere (list is reloaded) — remove unused params to satisfy ESLint
            .addCase(addCar.fulfilled, () => { })
            .addCase(editCar.fulfilled, () => { })
            .addCase(removeCar.fulfilled, () => { })
            .addCase(generateMany.fulfilled, () => { });
    },
});
export const { setPage, setCreateForm, setEditForm, selectCar, clearSelection } = slice.actions;
export default slice.reducer;
