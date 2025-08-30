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

  useEffect(() => {
    d(loadCars());
  }, [d, page, limit]);

  return (
    <main className="page garage">
      <ControlsBar />
      <div className="garage__list">
        {items.map(c => (
          <CarRow key={c.id} car={c} />
        ))}
      </div>

      <div className="garage__footer">
        <div className="count">GARAGE ({total})</div>
        <Pagination page={page} total={total} limit={limit} onChange={p => d(setPage(p))} />
      </div>

      <WinnerOverlay />
    </main>
  );
};

export default GaragePage;
