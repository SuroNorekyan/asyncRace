import { createAsyncThunk } from '@reduxjs/toolkit';
import { createCar, deleteCar, getCars, updateCar } from '../../shared/api/cars';
import { deleteWinner } from '../../shared/api/winners';
import { randomHex } from '../../shared/lib/colors';
import { randomName } from '../../shared/lib/names';
export const loadCars = createAsyncThunk('garage/load', async (_, { getState }) => {
    const { page, limit } = getState().garage;
    const { data, total } = await getCars(page, limit);
    return { items: data, total };
});
export const addCar = createAsyncThunk('garage/create', async (_, { getState, dispatch }) => {
    const { createForm } = getState().garage;
    if (!createForm.name.trim() || createForm.name.length > 30)
        return;
    await createCar({ name: createForm.name.trim(), color: createForm.color });
    await dispatch(loadCars());
    // if page changed due to new item, keep current page (server-side order is append)
});
export const editCar = createAsyncThunk('garage/update', async (_, { getState, dispatch }) => {
    const { selectedId, editForm } = getState().garage;
    if (!selectedId)
        return;
    if (!editForm.name.trim() || editForm.name.length > 30)
        return;
    await updateCar(selectedId, { name: editForm.name.trim(), color: editForm.color });
    await dispatch(loadCars());
});
export const removeCar = createAsyncThunk('garage/delete', async (id, { getState, dispatch }) => {
    await deleteCar(id);
    // also remove from winners as per spec
    await deleteWinner(id).catch(() => { });
    const { page, limit, total } = getState().garage;
    const afterDeleteTotal = total - 1;
    const lastPage = Math.max(1, Math.ceil(afterDeleteTotal / limit));
    if (page > lastPage) {
        const { setPage } = await import('./garageSlice');
        dispatch(setPage(lastPage));
    }
    await dispatch(loadCars());
});
export const generateMany = createAsyncThunk('garage/generate', async (_, { dispatch }) => {
    const tasks = Array.from({ length: 100 }, () => createCar({ name: randomName(), color: randomHex() }));
    // Run with limited concurrency to be gentle
    const batch = 10;
    for (let i = 0; i < tasks.length; i += batch) {
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(tasks.slice(i, i + batch));
    }
    await dispatch(loadCars());
});
