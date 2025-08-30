import { AppDispatch, RootState } from '../../app/store';
import { drive, startEngine, stopEngine } from '../../shared/api/engine';
import { createWinner, getWinner, updateWinner } from '../../shared/api/winners';
import { setGlobal, setRun, setWinner } from './raceSlice';

const RACE_SPEED_MULT = Number(import.meta.env.VITE_SPEED_MULT ?? 240);
const MIN_ANIM_MS = Number(import.meta.env.VITE_MIN_ANIM_MS ?? 600); // avoid teleports
const PROGRESS_FPS = Number(import.meta.env.VITE_PROGRESS_FPS ?? 20); // throttle Redux updates
const TICK_INTERVAL = Math.max(1000 / Math.min(60, Math.max(10, PROGRESS_FPS)), 12); // clamp 10..60fps

function computeEtaMs(distance: number, velocity: number): number {
  // Boost backend velocity, but keep per-car differences
  const boosted = velocity * Math.max(1, RACE_SPEED_MULT);
  const eta = (distance / boosted) * 1000;
  // Ensure at least MIN_ANIM_MS so we get multiple frames
  return Math.max(MIN_ANIM_MS, Math.round(eta));
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

      // Throttled rAF progress loop (avoid React re-render overload)
      const loop = () => {
        const state = getState().race.byId[id];
        if (!state || state.status !== 'driving' || !state.startedAt || !state.etaMs) return;

        const now = Date.now();
        const t = Math.min(1, (now - state.startedAt) / state.etaMs);

        const prev = timers[id] ?? {};
        const last = prev.lastTick ?? 0;
        if (now - last >= TICK_INTERVAL) {
          // update lastTick only when we dispatch
          timers[id] = { ...prev, lastTick: now };
          dispatch(setRun({ id, run: { progress: t } }));
        } else {
          // keep timers object stable
          timers[id] = { ...prev };
        }

        timers[id]!.raf = requestAnimationFrame(loop);
      };

      timers[id] = { raf: requestAnimationFrame(loop), lastTick: 0 };

      // Backend "drive" may 500 → broken (freeze where it stopped)
      drive(id).catch(() => {
        clearTimers(id);
        const st = getState().race.byId[id];
        dispatch(setRun({ id, run: { status: 'broken', progress: st?.progress ?? 0 } }));
      });

      // Finish after ETA if still driving
      if (!timers[id]) timers[id] = {};
      timers[id]!.finish = window.setTimeout(() => {
        const state = getState().race.byId[id];
        if (state?.status === 'driving') {
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
  // snap back to start (omit optional fields instead of setting undefined)
  dispatch(setRun({ id, run: { status: 'idle', progress: 0 } }));
};

export const startRaceAll = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setWinner(null));
  dispatch(setGlobal('inProgress'));

  // race only cars on current page (assignment requirement)
  const cars = getState().garage.items;
  await Promise.all(cars.map(c => dispatch(startCar(c.id))));
};

export const resetRaceAll = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const cars = getState().garage.items;
  await Promise.all(
    cars.map(async c => {
      clearTimers(c.id);
      await stopEngine(c.id).catch(() => {});
      // set to idle; omit etaMs/startedAt to satisfy exactOptionalPropertyTypes
      dispatch(setRun({ id: c.id, run: { status: 'idle', progress: 0 } }));
    }),
  );
  dispatch(setGlobal('idle'));
  dispatch(setWinner(null));
};

export const bindWinnerListener = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const tick = () => {
    const st = getState();
    if (st.race.global !== 'inProgress') return;

    const finished = Object.entries(st.race.byId).find(([, r]) => r.status === 'finished');
    if (finished && !st.race.winner) {
      const id = Number(finished[0]);
      const name = st.garage.items.find(x => x.id === id)?.name ?? `#${id}`;
      const time = (st.race.byId[id]?.etaMs ?? 0) / 1000;

      dispatch(setWinner({ carId: id, name, time }));
      dispatch(setGlobal('finished'));

      (async () => {
        const existing = await getWinner(id)
          .then(r => r.data)
          .catch(() => null);
        if (!existing) await createWinner({ id, wins: 1, time });
        else
          await updateWinner(id, {
            wins: existing.wins + 1,
            time: Math.min(existing.time, time),
          });
      })();
    } else {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};
