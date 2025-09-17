import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setCreateForm, setEditForm } from '../../features/garage/garageSlice';
import { addCar, editCar, generateMany } from '../../features/garage/thunks';
import { bindWinnerListener, resetRaceAll, startRaceAll } from '../../features/race/runner';
import './ControlsBar.css';

// Helper for tooltip text
const getActionTitle = (isLocked: boolean, selectedCarId: number | null, action: string) => {
  if (isLocked) return 'Disabled during the race';
  if (!selectedCarId) return 'Select a car first';
  return action;
};

const ControlsBar = () => {
  const dispatch = useAppDispatch();
  const { createForm, editForm, selectedCarId } = useAppSelector(state => state.garage);
  const { global: globalRaceStatus } = useAppSelector(state => state.race);

  const isLocked = globalRaceStatus === 'inProgress';

  return (
    <section className="controls controls--frosted">
      {isLocked && (
        <div className="controls__lock" role="status">
          🚧 Race in progress — editing disabled
        </div>
      )}

      {/* Race / Reset */}
      <div className="cluster cluster--tight">
        <button
          type="button"
          className="btn primary btn--glow"
          disabled={isLocked}
          title={isLocked ? 'Disabled during the race' : 'Start race for current page'}
          onClick={() => {
            dispatch(startRaceAll());
            dispatch(bindWinnerListener());
          }}
        >
          🚦 RACE
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          title="Reset all cars on the current page"
          onClick={() => dispatch(resetRaceAll())}
        >
          🔄 RESET
        </button>
      </div>

      {/* Create */}
      <div className="cluster">
        <input
          className="input"
          placeholder="TYPE CAR BRAND"
          value={createForm.name}
          onChange={e => dispatch(setCreateForm({ ...createForm, name: e.target.value }))}
          disabled={isLocked}
        />
        <input
          type="color"
          className="picker"
          aria-label="Pick color for new car"
          value={createForm.color}
          onChange={e => dispatch(setCreateForm({ ...createForm, color: e.target.value }))}
          disabled={isLocked}
        />
        <button
          type="button"
          className={`btn btn--soft ${isLocked ? 'btn--locked' : ''}`}
          disabled={isLocked}
          onClick={() => dispatch(addCar())}
        >
          ➕ CREATE
        </button>
      </div>

      {/* Update */}
      <div className="cluster">
        <input
          className="input"
          placeholder="TYPE CAR BRAND"
          value={editForm.name}
          onChange={e => dispatch(setEditForm({ ...editForm, name: e.target.value }))}
          disabled={isLocked || !selectedCarId}
          title={getActionTitle(isLocked, selectedCarId, 'Car name')}
        />
        <input
          type="color"
          className="picker"
          aria-label="Pick color to update selected car"
          value={editForm.color}
          onChange={e => dispatch(setEditForm({ ...editForm, color: e.target.value }))}
          disabled={isLocked || !selectedCarId}
          title={getActionTitle(isLocked, selectedCarId, 'Pick color')}
        />
        <button
          type="button"
          className={`btn btn--soft ${isLocked || !selectedCarId ? 'btn--locked' : ''}`}
          disabled={isLocked || !selectedCarId}
          title={getActionTitle(isLocked, selectedCarId, 'Update car')}
          onClick={() => dispatch(editCar())}
        >
          ✏️ UPDATE
        </button>
      </div>

      {/* Generate */}
      <button
        type="button"
        className={`btn success btn--glow ${isLocked ? 'btn--locked' : ''}`}
        title={isLocked ? 'Disabled during the race' : 'Generate 100 random cars'}
        disabled={isLocked}
        onClick={() => dispatch(generateMany())}
      >
        🎲 GENERATE CARS
      </button>
    </section>
  );
};

export default ControlsBar;
