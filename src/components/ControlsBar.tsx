import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCreateForm, setEditForm } from '../features/garage/garageSlice';
import { addCar, editCar, generateMany } from '../features/garage/thunks';
import { bindWinnerListener, resetRaceAll, startRaceAll } from '../features/race/runner';

// small helper to avoid nested ternaries (kept outside component to not increase its line count)
const pickTitle = (locked: boolean, selectedId: number | null, whenOk: string) => {
  if (locked) return 'Disabled during the race';
  if (!selectedId) return 'Select a car first';
  return whenOk;
};

const ControlsBar = () => {
  const d = useAppDispatch();
  const { createForm, editForm, selectedId } = useAppSelector(s => s.garage);
  const { global } = useAppSelector(s => s.race);

  const locked = global === 'inProgress'; // block actions during race

  const createTitle = locked ? 'Disabled during the race' : 'Create car';
  const createNameTitle = locked ? 'Disabled during the race' : 'Car name';
  const createColorTitle = locked ? 'Disabled during the race' : 'Pick color';

  const updateTitle = pickTitle(locked, selectedId, 'Update car');
  const updateNameTitle = pickTitle(locked, selectedId, 'Car name');
  const updateColorTitle = pickTitle(locked, selectedId, 'Pick color');

  return (
    <section className="controls controls--frosted">
      {/* Lock banner */}
      {locked && (
        <div className="controls__lock" role="status">
          🚧 Race in progress — editing disabled
        </div>
      )}

      {/* Race / Reset */}
      <div className="cluster cluster--tight">
        <button
          type="button"
          className="btn primary btn--glow"
          disabled={locked}
          title={locked ? 'Disabled during the race' : 'Start race for current page'}
          onClick={() => {
            d(startRaceAll());
            d(bindWinnerListener());
          }}
        >
          🚦 RACE
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          title="Reset all cars on the current page"
          onClick={() => d(resetRaceAll())}
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
          onChange={e => d(setCreateForm({ ...createForm, name: e.target.value }))}
          disabled={locked}
          title={createNameTitle}
        />
        <input
          type="color"
          className="picker"
          aria-label="Pick color for new car"
          value={createForm.color}
          onChange={e => d(setCreateForm({ ...createForm, color: e.target.value }))}
          disabled={locked}
          title={createColorTitle}
        />
        <button
          type="button"
          className={`btn btn--soft ${locked ? 'btn--locked' : ''}`}
          title={createTitle}
          disabled={locked}
          onClick={() => d(addCar())}
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
          onChange={e => d(setEditForm({ ...editForm, name: e.target.value }))}
          disabled={locked || !selectedId}
          title={updateNameTitle}
        />
        <input
          type="color"
          className="picker"
          aria-label="Pick color to update selected car"
          value={editForm.color}
          onChange={e => d(setEditForm({ ...editForm, color: e.target.value }))}
          disabled={locked || !selectedId}
          title={updateColorTitle}
        />
        <button
          type="button"
          className={`btn btn--soft ${locked || !selectedId ? 'btn--locked' : ''}`}
          disabled={locked || !selectedId}
          title={updateTitle}
          onClick={() => d(editCar())}
        >
          ✏️ UPDATE
        </button>
      </div>

      {/* Generate */}
      <button
        type="button"
        className={`btn success btn--glow ${locked ? 'btn--locked' : ''}`}
        title={locked ? 'Disabled during the race' : 'Generate 100 random cars'}
        disabled={locked}
        onClick={() => d(generateMany())}
      >
        🎲 GENERATE CARS
      </button>
    </section>
  );
};

export default ControlsBar;
