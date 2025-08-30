import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Car } from '../../shared/types';
import { addCar, editCar, generateMany, loadCars, removeCar } from './thunks';

type Form = { name: string; color: string };
type GarageState = {
  items: Car[];
  total: number;
  page: number;
  limit: number;
  selectedId: number | null;
  createForm: Form;
  editForm: Form;
  loading: boolean;
};

const initial: GarageState = {
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
    setPage: (s, a: PayloadAction<number>) => {
      s.page = a.payload;
    },
    setCreateForm: (s, a: PayloadAction<Form>) => {
      s.createForm = a.payload;
    },
    setEditForm: (s, a: PayloadAction<Form>) => {
      s.editForm = a.payload;
    },
    selectCar: (s, a: PayloadAction<number>) => {
      s.selectedId = a.payload;
      const found = s.items.find(c => c.id === a.payload);
      if (found) s.editForm = { name: found.name, color: found.color };
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
      .addCase(addCar.fulfilled, () => {})
      .addCase(editCar.fulfilled, () => {})
      .addCase(removeCar.fulfilled, () => {})
      .addCase(generateMany.fulfilled, () => {});
  },
});

export const { setPage, setCreateForm, setEditForm, selectCar, clearSelection } = slice.actions;
export default slice.reducer;
