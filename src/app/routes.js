import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from 'react-router-dom';
import GaragePage from '../pages/GaragePage';
import WinnersPage from '../pages/WinnersPage';
const AppRoutes = () => (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/garage", replace: true }) }), _jsx(Route, { path: "/garage", element: _jsx(GaragePage, {}) }), _jsx(Route, { path: "/winners", element: _jsx(WinnersPage, {}) })] }));
export default AppRoutes;
