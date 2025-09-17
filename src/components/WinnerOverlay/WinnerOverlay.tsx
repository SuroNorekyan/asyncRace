import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setGlobal, setWinner } from '../../features/race/raceSlice';
import { bindWinnerListener, resetRaceAll, startRaceAll } from '../../features/race/runner';
import './WinnerOverlay.css';

const WinnerOverlay = () => {
  const d = useAppDispatch();
  const winner = useAppSelector(s => s.race.winner);
  const visible = !!winner;

  if (!visible) return null;

  return (
    <div className="overlay">
      <div className="overlay__card winner-card">
        {/* Close button */}
        <button type="button" className="overlay__close" onClick={() => d(setWinner(null))}>
          ✖
        </button>

        <div className="overlay__title">🏆 WINNER 🏆</div>
        <div className="overlay__name">{winner?.name}</div>
        <div className="overlay__time">TIME: {winner?.time.toFixed(2)} s</div>

        <div className="overlay__actions">
          <button
            type="button"
            className="btn danger"
            onClick={() => {
              d(setWinner(null));
              d(resetRaceAll());
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn success"
            onClick={() => {
              d(setWinner(null));
              d(setGlobal('idle'));
              d(startRaceAll());
              d(bindWinnerListener());
            }}
          >
            Start a New Race
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerOverlay;
