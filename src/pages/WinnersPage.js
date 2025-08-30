import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import WinnersTable from '../components/WinnersTable';
import { loadWinners } from '../features/winners/thunks';
const WinnersPage = () => {
    const d = useAppDispatch();
    // pull state so useEffect can respond to changes
    const { page, limit, sort, order } = useAppSelector(s => s.winners);
    useEffect(() => {
        d(loadWinners());
    }, [d, page, limit, sort, order]); // <- important
    return (_jsx("main", { className: "page winners", children: _jsx(WinnersTable, {}) }));
};
export default WinnersPage;
