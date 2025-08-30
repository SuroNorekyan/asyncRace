import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CarRow from '../components/CarRow';
import ControlsBar from '../components/ControlsBar';
import Pagination from '../components/Pagination';
import WinnerOverlay from '../components/WinnerOverlay';
import { setPage } from '../features/garage/garageSlice';
import { loadCars } from '../features/garage/thunks';

const GaragePage = () => {
  const d = useAppDispatch();
  const { items, total, page, limit } = useAppSelector(s => s.garage);

  // load data on page/limit changes
  useEffect(() => {
    d(loadCars());
  }, [d, page, limit]);

  // if current page became empty after deletion, step back (until page 1)
  useEffect(() => {
    if (page > 1 && items.length === 0) {
      d(setPage(page - 1));
    }
  }, [d, page, items.length]);

  const isEmptyGarage = total === 0;

  return (
    <main className="page garage">
      <ControlsBar />

      {isEmptyGarage ? (
        <div className="empty-state">
          <div className="empty-state__title">No cars yet</div>
          <div className="empty-state__hint">Use “CREATE” or “GENERATE CARS” to add some.</div>
        </div>
      ) : (
        <>
          <div className="garage__list">
            {items.map(c => (
              <CarRow key={c.id} car={c} />
            ))}
          </div>

          <div className="garage__footer">
            <div className="count">GARAGE ({total})</div>
            <Pagination page={page} total={total} limit={limit} onChange={p => d(setPage(p))} />
          </div>
        </>
      )}

      <WinnerOverlay />
    </main>
  );
};

export default GaragePage;
