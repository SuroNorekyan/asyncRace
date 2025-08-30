import { configureStore } from '@reduxjs/toolkit';
import garageReducer from '../features/garage/garageSlice';
import raceReducer from '../features/race/raceSlice';
import winnersReducer from '../features/winners/winnersSlice';

export const store = configureStore({
  reducer: {
    garage: garageReducer,
    race: raceReducer,
    winners: winnersReducer,
  },
  middleware: getDefault => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
