import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { createCar, deleteCar, getCars, updateCar } from '../../shared/api/cars';
import { deleteWinner } from '../../shared/api/winners';
import { randomHex } from '../../shared/lib/colors';
import { randomName } from '../../shared/lib/names';

// Constants
const MAX_CAR_NAME_LENGTH = 30;
const GENERATE_CAR_COUNT = 100;
const GENERATE_BATCH_SIZE = 10;

export const loadCars = createAsyncThunk('garage/load', async (_, { getState }) => {
  const { page, limit } = (getState() as RootState).garage;
  const { data, total } = await getCars(page, limit);
  return { items: data, total };
});

export const addCar = createAsyncThunk('garage/create', async (_: void, { getState, dispatch }) => {
  const { createForm } = (getState() as RootState).garage;
  if (!createForm.name.trim() || createForm.name.length > MAX_CAR_NAME_LENGTH) return;
  await createCar({ name: createForm.name.trim(), color: createForm.color });
  await dispatch(loadCars());
});

export const editCar = createAsyncThunk(
  'garage/update',
  async (_: void, { getState, dispatch }) => {
    const { selectedCarId, editForm } = (getState() as RootState).garage;
    if (!selectedCarId) return;
    if (!editForm.name.trim() || editForm.name.length > MAX_CAR_NAME_LENGTH) return;
    await updateCar(selectedCarId, { name: editForm.name.trim(), color: editForm.color });
    await dispatch(loadCars());
  },
);

export const removeCar = createAsyncThunk(
  'garage/delete',
  async (id: number, { getState, dispatch }) => {
    await deleteCar(id);
    await deleteWinner(id).catch(() => {});

    const { page, limit, total } = (getState() as RootState).garage;
    const afterDeleteTotal = total - 1;
    const lastPage = Math.max(1, Math.ceil(afterDeleteTotal / limit));
    if (page > lastPage) {
      const { setPage } = await import('./garageSlice');
      dispatch(setPage(lastPage));
    }
    await dispatch(loadCars());
  },
);

export const generateMany = createAsyncThunk('garage/generate', async (_: void, { dispatch }) => {
  const tasks = Array.from({ length: GENERATE_CAR_COUNT }, () =>
    createCar({ name: randomName(), color: randomHex() }),
  );
  for (let i = 0; i < tasks.length; i += GENERATE_BATCH_SIZE) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(tasks.slice(i, i + GENERATE_BATCH_SIZE));
  }
  await dispatch(loadCars());
});
