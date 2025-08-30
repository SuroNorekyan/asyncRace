import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CarRun = {
  status: 'idle' | 'started' | 'driving' | 'stopped' | 'broken' | 'finished';
  progress: number; // 0..1
  etaMs?: number;
  startedAt?: number;
};

type WinnerInfo = { carId: number; name: string; time: number } | null;

type RaceState = {
  byId: Record<number, CarRun>;
  global: 'idle' | 'inProgress' | 'finished';
  winner: WinnerInfo;
};

const initial: RaceState = { byId: {}, global: 'idle', winner: null };

const slice = createSlice({
  name: 'race',
  initialState: initial,
  reducers: {
    setRun: (s, a: PayloadAction<{ id: number; run: Partial<CarRun> }>) => {
      const prev = s.byId[a.payload.id] ?? { status: 'idle', progress: 0 };
      s.byId[a.payload.id] = { ...prev, ...a.payload.run };
    },
    setGlobal: (s, a: PayloadAction<RaceState['global']>) => {
      s.global = a.payload;
    },
    setWinner: (s, a: PayloadAction<WinnerInfo>) => {
      s.winner = a.payload;
    },
    resetAll: () => initial,
  },
});

export const { setRun, setGlobal, setWinner, resetAll } = slice.actions;
export default slice.reducer;
