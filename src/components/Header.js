import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
const Header = () => {
    const { pathname } = useLocation();
    return (_jsxs("header", { className: "header header--frosted", children: [_jsxs("div", { className: "logo", children: [_jsxs("span", { className: "logo__stack", children: [_jsx("span", { className: "logo__word", children: "ASYNC" }), _jsx("span", { className: "logo__word logo__word--accent", children: "RACE" })] }), _jsx("span", { className: "logo__glow", "aria-hidden": "true" })] }), _jsxs("nav", { className: "header__nav", children: [_jsx(NavLink, { to: "/garage", className: `btn nav ${pathname === '/garage' ? 'active' : ''}`, children: "GARAGE" }), _jsx(NavLink, { to: "/winners", className: `btn nav ${pathname === '/winners' ? 'active' : ''}`, children: "WINNERS" })] })] }));
};
export default Header;
