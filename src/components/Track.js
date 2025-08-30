import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Track = ({ progress, color }) => (_jsxs("div", { className: "track", children: [_jsx("div", { className: "start", children: "START" }), _jsx("div", { className: "finish", children: "FINISH" }), _jsx("div", { className: "car", style: { transform: `translateX(${progress * 92}%)`, color }, children: _jsx("div", { className: "car__body" }) })] }));
export default Track;
