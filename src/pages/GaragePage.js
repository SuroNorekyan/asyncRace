import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("main", { className: "page garage", children: [_jsx(ControlsBar, {}), _jsx("div", { className: "garage__list", children: items.map(c => (_jsx(CarRow, { car: c }, c.id))) }), _jsxs("div", { className: "garage__footer", children: [_jsxs("div", { className: "count", children: ["GARAGE (", total, ")"] }), _jsx(Pagination, { page: page, total: total, limit: limit, onChange: p => d(setPage(p)) })] }), _jsx(WinnerOverlay, {})] }));
};
export default GaragePage;
