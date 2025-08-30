import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SortField, SortOrder, WinnerRow } from '../../shared/types';
import { loadWinners } from './thunks';

type WinnersState = {
  rows: WinnerRow[];
  total: number;
  page: number;
  limit: number;
  sort: SortField;
  order: SortOrder;
  loading: boolean;
};

const initial: WinnersState = {
  rows: [],
  total: 0,
  page: 1,
  limit: 10,
  sort: 'id',
  order: 'ASC',
  loading: false,
};

const slice = createSlice({
  name: 'winners',
  initialState: initial,
  reducers: {
    setWinnersPage: (s, a: PayloadAction<number>) => {
      s.page = a.payload;
    },
    setSort: (s, a: PayloadAction<{ sort: SortField; order: SortOrder }>) => {
      s.sort = a.payload.sort;
      s.order = a.payload.order;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadWinners.pending, s => {
        s.loading = true;
      })
      .addCase(loadWinners.fulfilled, (s, a) => {
        s.loading = false;
        s.rows = a.payload.rows;
        s.total = a.payload.total;
      });
  },
});

export const { setWinnersPage, setSort } = slice.actions;
export default slice.reducer;
