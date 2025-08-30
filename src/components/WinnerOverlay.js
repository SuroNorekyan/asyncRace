import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setGlobal, setWinner } from '../features/race/raceSlice';
import { bindWinnerListener, resetRaceAll, startRaceAll } from '../features/race/runner';
const WinnerOverlay = () => {
    const d = useAppDispatch();
    const winner = useAppSelector(s => s.race.winner);
    const visible = !!winner;
    if (!visible)
        return null;
    return (_jsx("div", { className: "overlay", children: _jsxs("div", { className: "overlay__card winner-card", children: [_jsx("button", { type: "button", className: "overlay__close", onClick: () => d(setWinner(null)), children: "\u2716" }), _jsx("div", { className: "overlay__title", children: "\uD83C\uDFC6 WINNER \uD83C\uDFC6" }), _jsx("div", { className: "overlay__name", children: winner?.name }), _jsxs("div", { className: "overlay__time", children: ["TIME: ", winner?.time.toFixed(2), " s"] }), _jsxs("div", { className: "overlay__actions", children: [_jsx("button", { type: "button", className: "btn danger", onClick: () => {
                                d(setWinner(null));
                                d(resetRaceAll());
                            }, children: "Reset" }), _jsx("button", { type: "button", className: "btn success", onClick: () => {
                                d(setWinner(null));
                                d(setGlobal('idle'));
                                d(startRaceAll());
                                d(bindWinnerListener());
                            }, children: "Start a New Race" })] })] }) }));
};
export default WinnerOverlay;
