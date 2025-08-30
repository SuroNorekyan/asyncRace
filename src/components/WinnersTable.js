import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loadWinners } from '../features/winners/thunks';
import { setSort, setWinnersPage } from '../features/winners/winnersSlice';
import Pagination from './Pagination';
const WinnersTable = () => {
    const d = useAppDispatch();
    const { rows, total, page, limit, sort, order } = useAppSelector(s => s.winners);
    const toggleSort = (field) => {
        const nextOrder = sort === field && order === 'ASC' ? 'DESC' : 'ASC';
        d(setSort({ sort: field, order: nextOrder }));
        d(loadWinners());
    };
    return (_jsxs("section", { className: "winners", children: [_jsxs("div", { className: "winners__header", children: [_jsx("h2", { children: "WINNERS" }), _jsxs("div", { className: "sorts", children: [_jsx("button", { type: "button", className: "btn small", onClick: () => toggleSort('wins'), children: "Sort by wins" }), _jsx("button", { type: "button", className: "btn small", onClick: () => toggleSort('time'), children: "Sort by best time" })] })] }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u2116" }), _jsx("th", { children: "CAR" }), _jsx("th", { children: "NAME" }), _jsx("th", { children: "WINS" }), _jsx("th", { children: "BEST TIME (SECONDS)" })] }) }), _jsx("tbody", { children: rows.map((w, idx) => (_jsxs("tr", { children: [_jsx("td", { children: (page - 1) * limit + idx + 1 }), _jsx("td", { children: _jsx("div", { className: "car-chip", style: { borderColor: w.car.color } }) }), _jsx("td", { children: w.car.name }), _jsx("td", { children: w.wins }), _jsx("td", { children: w.time.toFixed(2) })] }, w.id))) })] }), _jsx(Pagination, { page: page, total: total, limit: limit, onChange: p => {
                    d(setWinnersPage(p));
                    d(loadWinners());
                } })] }));
};
export default WinnersTable;
