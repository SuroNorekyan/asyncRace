import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearSelection, selectCar } from '../../features/garage/garageSlice';
import { removeCar as removeCarThunk } from '../../features/garage/thunks';
import { startCar, stopCar } from '../../features/race/runner';
import type { Car } from '../../shared/types';
import './CarRow.css';

type Props = { car: Car };

// Constants for responsive track widths
const TRACK_WIDTH_DESKTOP = 92;
const TRACK_WIDTH_TABLET = 86;
const TRACK_WIDTH_MOBILE = 80;

const CarRow = ({ car }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedCarId } = useAppSelector(state => state.garage);
  const carRun = useAppSelector(state => state.race.byId[car.id]);
  const globalRaceStatus = useAppSelector(state => state.race.global);

  const isSelected = selectedCarId === car.id;
  const status = carRun?.status ?? 'idle';

  // race lock: when a global race is running we freeze row actions
  const isRaceLocked = globalRaceStatus === 'inProgress';

  // Button enable/disable rules
  const canSelect = !isRaceLocked;
  const canRemove = !isRaceLocked;
  const canStart = !isRaceLocked && status !== 'driving' && globalRaceStatus !== 'finished';
  const canStop = !isRaceLocked && !(status === 'idle' || status === 'stopped');

  // Responsive cap so the car never overflows the row
  const [maxTrackPercent, setMaxTrackPercent] = useState<number>(TRACK_WIDTH_DESKTOP);

  useEffect(() => {
    const updateTrackWidth = () => {
      const width = window.innerWidth;
      if (width <= 420) setMaxTrackPercent(TRACK_WIDTH_MOBILE);
      else if (width <= 640) setMaxTrackPercent(TRACK_WIDTH_TABLET);
      else setMaxTrackPercent(TRACK_WIDTH_DESKTOP);
    };
    updateTrackWidth();
    window.addEventListener('resize', updateTrackWidth);
    return () => window.removeEventListener('resize', updateTrackWidth);
  }, []);

  const leftPercent = ((carRun?.progress ?? 0) * maxTrackPercent).toFixed(3);

  // helper to add a locked style when disabled
  const getButtonClasses = (baseClass: string, isEnabled: boolean) =>
    clsx(baseClass, !isEnabled && 'btn--locked');

  // Tooltips
  const startButtonTitle = (() => {
    if (isRaceLocked) return 'Disabled during the race';
    if (status === 'driving') return 'Already driving';
    return 'Start';
  })();

  const stopButtonTitle = (() => {
    if (isRaceLocked) return 'Disabled during the race';
    if (status === 'idle' || status === 'stopped') return 'Car is at start';
    return 'Stop';
  })();

  return (
    <div className="car-row">
      <div className="car-row__top">
        <div className="car-row__buttons">
          <button
            type="button"
            className={getButtonClasses('btn small', canSelect)}
            disabled={!canSelect}
            title={isRaceLocked ? 'Disabled during the race' : 'Select'}
            onClick={() => dispatch(isSelected ? clearSelection() : selectCar(car.id))}
          >
            SELECT
          </button>

          <button
            type="button"
            className={getButtonClasses('btn small danger', canRemove)}
            disabled={!canRemove}
            title={isRaceLocked ? 'Disabled during the race' : 'Remove'}
            onClick={() => dispatch(removeCarThunk(car.id))}
          >
            REMOVE
          </button>

          <button
            type="button"
            className={getButtonClasses('btn small', canStart)}
            disabled={!canStart}
            title={startButtonTitle}
            onClick={() => dispatch(startCar(car.id))}
            aria-label="Start engine"
          >
            Start Engine
          </button>

          <button
            type="button"
            className={getButtonClasses('btn small', canStop)}
            disabled={!canStop}
            title={stopButtonTitle}
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

      {isRaceLocked && <div className="race-lock-hint">Disabled during the race</div>}

      <div className="car-row__track">
        <div className="lane">
          <div
            className={clsx('car-sprite', status === 'broken' && 'broken')}
            style={{ left: `${leftPercent}%`, borderColor: car.color }}
          >
            {status === 'broken' && <div className="car-broken-cross">✖</div>}
          </div>
          <div className="finish-line" style={{ right: '10px' }} />
        </div>
      </div>

      {status === 'broken' && <div className="engine-broke-label">Engine broke</div>}
    </div>
  );
};

export default CarRow;
