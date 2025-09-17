import { AppDispatch, RootState } from '../../app/store';
import { drive, startEngine, stopEngine } from '../../shared/api/engine';
import { createWinner, getWinner, updateWinner } from '../../shared/api/winners';
import { setGlobal, setRun, setWinner } from './raceSlice';

// Constants with fallback defaults
const DEFAULT_SPEED_MULTIPLIER = 240;
const DEFAULT_MIN_ANIMATION_MS = 600; // Prevent instant teleport
const DEFAULT_PROGRESS_FPS = 20; // Default frames per second
const MIN_FPS = 10;
const MAX_FPS = 60;
const MIN_TICK_INTERVAL = 12; // Lower bound for interval ms

const RACE_SPEED_MULTIPLIER = Number(import.meta.env.VITE_SPEED_MULT ?? DEFAULT_SPEED_MULTIPLIER);
const MIN_ANIMATION_MS = Number(import.meta.env.VITE_MIN_ANIM_MS ?? DEFAULT_MIN_ANIMATION_MS);
const PROGRESS_FPS = Number(import.meta.env.VITE_PROGRESS_FPS ?? DEFAULT_PROGRESS_FPS);

const TICK_INTERVAL = Math.max(
  1000 / Math.min(MAX_FPS, Math.max(MIN_FPS, PROGRESS_FPS)),
  MIN_TICK_INTERVAL,
);

function computeEtaMs(distance: number, velocity: number): number {
  const boostedVelocity = velocity * Math.max(1, RACE_SPEED_MULTIPLIER);
  const etaMs = (distance / boostedVelocity) * 1000;
  return Math.max(MIN_ANIMATION_MS, Math.round(etaMs));
}

type Timers = { raf?: number; finish?: number; lastTick?: number };
const timers: Record<number, Timers> = {};

const clearTimers = (id: number) => {
  const t = timers[id];
  if (t?.raf !== undefined) cancelAnimationFrame(t.raf);
  if (t?.finish !== undefined) clearTimeout(t.finish);
  delete timers[id];
};

export const startCar =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    clearTimers(id);
    const startedAt = Date.now();
    dispatch(setRun({ id, run: { status: 'started', progress: 0, startedAt } }));

    try {
      const { velocity, distance } = await startEngine(id);
      const etaMs = computeEtaMs(distance, velocity);

      dispatch(setRun({ id, run: { status: 'driving', etaMs, startedAt } }));

      const loop = () => {
        const carState = getState().race.byId[id];
        if (!carState || carState.status !== 'driving' || !carState.startedAt || !carState.etaMs)
          return;

        const now = Date.now();
        const progress = Math.min(1, (now - carState.startedAt) / carState.etaMs);

        const prevTimers = timers[id] ?? {};
        const lastTick = prevTimers.lastTick ?? 0;
        if (now - lastTick >= TICK_INTERVAL) {
          timers[id] = { ...prevTimers, lastTick: now };
          dispatch(setRun({ id, run: { progress } }));
        } else {
          timers[id] = { ...prevTimers };
        }

        timers[id]!.raf = requestAnimationFrame(loop);
      };

      timers[id] = { raf: requestAnimationFrame(loop), lastTick: 0 };

      drive(id).catch(() => {
        clearTimers(id);
        const carState = getState().race.byId[id];
        dispatch(setRun({ id, run: { status: 'broken', progress: carState?.progress ?? 0 } }));
      });

      if (!timers[id]) timers[id] = {};
      timers[id]!.finish = window.setTimeout(() => {
        const carState = getState().race.byId[id];
        if (carState?.status === 'driving') {
          dispatch(setRun({ id, run: { status: 'finished', progress: 1 } }));
        }
        clearTimers(id);
      }, etaMs);
    } catch {
      clearTimers(id);
      dispatch(setRun({ id, run: { status: 'broken', progress: 0 } }));
    }
  };

export const stopCar = (id: number) => async (dispatch: AppDispatch) => {
  clearTimers(id);
  await stopEngine(id).catch(() => {});
  dispatch(setRun({ id, run: { status: 'idle', progress: 0 } }));
};

export const startRaceAll = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setWinner(null));
  dispatch(setGlobal('inProgress'));
  const cars = getState().garage.items;
  await Promise.all(cars.map(c => dispatch(startCar(c.id))));
};

export const resetRaceAll = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const cars = getState().garage.items;
  await Promise.all(
    cars.map(async c => {
      clearTimers(c.id);
      await stopEngine(c.id).catch(() => {});
      dispatch(setRun({ id: c.id, run: { status: 'idle', progress: 0 } }));
    }),
  );
  dispatch(setGlobal('idle'));
  dispatch(setWinner(null));
};

export const bindWinnerListener = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const tick = () => {
    const state = getState();
    if (state.race.global !== 'inProgress') return;

    const finished = Object.entries(state.race.byId).find(([, r]) => r.status === 'finished');
    if (finished && !state.race.winner) {
      const id = Number(finished[0]);
      const carName = state.garage.items.find(x => x.id === id)?.name ?? `#${id}`;
      const finishTime = (state.race.byId[id]?.etaMs ?? 0) / 1000;

      dispatch(setWinner({ carId: id, name: carName, time: finishTime }));
      dispatch(setGlobal('finished'));

      (async () => {
        const existing = await getWinner(id)
          .then(r => r.data)
          .catch(() => null);
        if (!existing) await createWinner({ id, wins: 1, time: finishTime });
        else
          await updateWinner(id, {
            wins: existing.wins + 1,
            time: Math.min(existing.time, finishTime),
          });
      })();
    } else {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};
