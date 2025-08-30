import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Pagination = ({ page, total, limit, onChange }) => {
    const pages = Math.max(1, Math.ceil(total / limit));
    return (_jsxs("div", { className: "pagination", children: [_jsx("button", { className: "btn small", disabled: page <= 1, onClick: () => onChange(page - 1), type: "button", children: "\u2039" }), _jsx("span", { children: `PAGE #${page}` }), _jsx("button", { className: "btn small", disabled: page >= pages, onClick: () => onChange(page + 1), type: "button", children: "\u203A" })] }));
};
export default Pagination;
