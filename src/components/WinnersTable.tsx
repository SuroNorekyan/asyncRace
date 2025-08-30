import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadWinners } from '../features/winners/thunks';
import { setSort, setWinnersPage } from '../features/winners/winnersSlice';
import Pagination from './Pagination';

const WinnersTable = () => {
  const d = useAppDispatch();
  const { rows, total, page, limit, sort, order } = useAppSelector(s => s.winners);

  const toggleSort = (field: 'wins' | 'time') => {
    const nextOrder = sort === field && order === 'ASC' ? 'DESC' : 'ASC';
    d(setSort({ sort: field, order: nextOrder }));
    d(loadWinners());
  };

  return (
    <section className="winners">
      <div className="winners__header">
        <h2>WINNERS</h2>
        <div className="sorts">
          <button type="button" className="btn small" onClick={() => toggleSort('wins')}>
            Sort by wins
          </button>
          <button type="button" className="btn small" onClick={() => toggleSort('time')}>
            Sort by best time
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>CAR</th>
            <th>NAME</th>
            <th>WINS</th>
            <th>BEST TIME (SECONDS)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w, idx) => (
            <tr key={w.id}>
              <td>{(page - 1) * limit + idx + 1}</td>
              <td>
                <div className="car-chip" style={{ borderColor: w.car.color }} />
              </td>
              <td>{w.car.name}</td>
              <td>{w.wins}</td>
              <td>{w.time.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        total={total}
        limit={limit}
        onChange={p => {
          d(setWinnersPage(p));
          d(loadWinners());
        }}
      />
    </section>
  );
};

export default WinnersTable;
