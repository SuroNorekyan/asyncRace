import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearSelection, selectCar } from '../features/garage/garageSlice';
import { removeCar as removeCarThunk } from '../features/garage/thunks';
import { startCar, stopCar } from '../features/race/runner';
import type { Car } from '../shared/types';

type Props = { car: Car };

const CarRow = ({ car }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedId } = useAppSelector(s => s.garage);
  const run = useAppSelector(s => s.race.byId[car.id]);
  const global = useAppSelector(s => s.race.global);

  const isSelected = selectedId === car.id;
  const status = run?.status ?? 'idle';

  // race lock: when a global race is running we freeze row actions
  const isRaceLocked = global === 'inProgress';

  // Button enable/disable rules
  const canSelect = !isRaceLocked;
  const canRemove = !isRaceLocked;
  const canStart = !isRaceLocked && status !== 'driving' && global !== 'finished';
  const canStop = !isRaceLocked && !(status === 'idle' || status === 'stopped');

  // Responsive cap so the car never overflows the row
  const [maxPct, setMaxPct] = useState<number>(92); // Desktop
  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      if (w <= 420) setMaxPct(80);
      else if (w <= 640) setMaxPct(86);
      else setMaxPct(92);
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);
  const leftPct = ((run?.progress ?? 0) * maxPct).toFixed(3);

  // helper to add a locked style when disabled
  const btnCx = (base: string, enabled: boolean) => clsx(base, !enabled && 'btn--locked');

  // --- tooltips without nested ternaries ---
  const startTitle = (() => {
    if (isRaceLocked) return 'Disabled during the race';
    if (status === 'driving') return 'Already driving';
    return 'Start';
  })();

  const stopTitle = (() => {
    if (isRaceLocked) return 'Disabled during the race';
    if (status === 'idle' || status === 'stopped') return 'Car is at start';
    return 'Stop';
  })();

  return (
    <div className="car-row">
      {/* top line: buttons + name (no overlap) */}
      <div className="car-row__top">
        <div className="car-row__buttons">
          <button
            type="button"
            className={btnCx('btn small', canSelect)}
            disabled={!canSelect}
            title={isRaceLocked ? 'Disabled during the race' : 'Select'}
            onClick={() => dispatch(isSelected ? clearSelection() : selectCar(car.id))}
          >
            SELECT
          </button>

          <button
            type="button"
            className={btnCx('btn small danger', canRemove)}
            disabled={!canRemove}
            title={isRaceLocked ? 'Disabled during the race' : 'Remove'}
            onClick={() => dispatch(removeCarThunk(car.id))}
          >
            REMOVE
          </button>

          <button
            type="button"
            className={btnCx('btn small', canStart)}
            disabled={!canStart}
            title={startTitle}
            onClick={() => dispatch(startCar(car.id))}
            aria-label="Start engine"
          >
            Start Engine
          </button>

          <button
            type="button"
            className={btnCx('btn small', canStop)}
            disabled={!canStop}
            title={stopTitle}
            onClick={() => dispatch(stopCar(car.id))}
            aria-label="Stop engine"
          >
            Stop Engine
          </button>
        </div>

        <div className="car-row__name" style={{ color: car.color }}>
          {car.name}
        </div>
      </div>

      {/* optional hint when locked */}
      {isRaceLocked && <div className="race-lock-hint">Disabled during the race</div>}

      {/* track line */}
      <div className="car-row__track">
        <div className="lane">
          <div
            className={clsx('car-sprite', status === 'broken' && 'broken')}
            style={{ left: `${leftPct}%`, borderColor: car.color }}
          >
            {status === 'broken' && <div className="car-broken-cross">✖</div>}
          </div>

          {/* finish line slightly shifted left */}
          <div className="finish-line" style={{ right: '10px' }} />
        </div>
      </div>

      {status === 'broken' && <div className="engine-broke-label">Engine broke</div>}
    </div>
  );
};

export default CarRow;
