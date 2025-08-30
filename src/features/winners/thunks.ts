import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getCar } from '../../shared/api/cars';
import { deleteWinner, getWinners } from '../../shared/api/winners';
import type { WinnerRow } from '../../shared/types';

export const loadWinners = createAsyncThunk('winners/load', async (_, { getState }) => {
  const { page, limit, sort, order } = (getState() as RootState).winners;
  const { data, total } = await getWinners(page, limit, sort, order);

  const rows: WinnerRow[] = [];
  let removed = 0;

  // handle each row independently so a 404 doesn't kill the whole list
  for (const w of data) {
    try {
      const car = (await getCar(w.id)).data;
      rows.push({ ...w, car: { name: car.name, color: car.color } });
    } catch {
      // Car no longer exists -> clean up the winners table to satisfy spec
      // (delete from winners when a car is deleted)
      // This is silent-best-effort; if it fails, just skip this row.
      // eslint-disable-next-line no-await-in-loop
      await deleteWinner(w.id).catch(() => {});
      removed += 1;
    }
  }

  return { rows, total: total - removed };
});

export default loadWinners;
