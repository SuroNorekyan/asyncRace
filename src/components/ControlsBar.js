import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCreateForm, setEditForm } from '../features/garage/garageSlice';
import { addCar, editCar, generateMany } from '../features/garage/thunks';
import { bindWinnerListener, resetRaceAll, startRaceAll } from '../features/race/runner';
// small helper to avoid nested ternaries (kept outside component to not increase its line count)
const pickTitle = (locked, selectedId, whenOk) => {
    if (locked)
        return 'Disabled during the race';
    if (!selectedId)
        return 'Select a car first';
    return whenOk;
};
const ControlsBar = () => {
    const d = useAppDispatch();
    const { createForm, editForm, selectedId } = useAppSelector(s => s.garage);
    const { global } = useAppSelector(s => s.race);
    const locked = global === 'inProgress'; // block actions during race
    const createTitle = locked ? 'Disabled during the race' : 'Create car';
    const createNameTitle = locked ? 'Disabled during the race' : 'Car name';
    const createColorTitle = locked ? 'Disabled during the race' : 'Pick color';
    const updateTitle = pickTitle(locked, selectedId, 'Update car');
    const updateNameTitle = pickTitle(locked, selectedId, 'Car name');
    const updateColorTitle = pickTitle(locked, selectedId, 'Pick color');
    return (_jsxs("section", { className: "controls controls--frosted", children: [locked && (_jsx("div", { className: "controls__lock", role: "status", children: "\uD83D\uDEA7 Race in progress \u2014 editing disabled" })), _jsxs("div", { className: "cluster cluster--tight", children: [_jsx("button", { type: "button", className: "btn primary btn--glow", disabled: locked, title: locked ? 'Disabled during the race' : 'Start race for current page', onClick: () => {
                            d(startRaceAll());
                            d(bindWinnerListener());
                        }, children: "\uD83D\uDEA6 RACE" }), _jsx("button", { type: "button", className: "btn btn--ghost", title: "Reset all cars on the current page", onClick: () => d(resetRaceAll()), children: "\uD83D\uDD04 RESET" })] }), _jsxs("div", { className: "cluster", children: [_jsx("input", { className: "input", placeholder: "TYPE CAR BRAND", value: createForm.name, onChange: e => d(setCreateForm({ ...createForm, name: e.target.value })), disabled: locked, title: createNameTitle }), _jsx("input", { type: "color", className: "picker", "aria-label": "Pick color for new car", value: createForm.color, onChange: e => d(setCreateForm({ ...createForm, color: e.target.value })), disabled: locked, title: createColorTitle }), _jsx("button", { type: "button", className: `btn btn--soft ${locked ? 'btn--locked' : ''}`, title: createTitle, disabled: locked, onClick: () => d(addCar()), children: "\u2795 CREATE" })] }), _jsxs("div", { className: "cluster", children: [_jsx("input", { className: "input", placeholder: "TYPE CAR BRAND", value: editForm.name, onChange: e => d(setEditForm({ ...editForm, name: e.target.value })), disabled: locked || !selectedId, title: updateNameTitle }), _jsx("input", { type: "color", className: "picker", "aria-label": "Pick color to update selected car", value: editForm.color, onChange: e => d(setEditForm({ ...editForm, color: e.target.value })), disabled: locked || !selectedId, title: updateColorTitle }), _jsx("button", { type: "button", className: `btn btn--soft ${locked || !selectedId ? 'btn--locked' : ''}`, disabled: locked || !selectedId, title: updateTitle, onClick: () => d(editCar()), children: "\u270F\uFE0F UPDATE" })] }), _jsx("button", { type: "button", className: `btn success btn--glow ${locked ? 'btn--locked' : ''}`, title: locked ? 'Disabled during the race' : 'Generate 100 random cars', disabled: locked, onClick: () => d(generateMany()), children: "\uD83C\uDFB2 GENERATE CARS" })] }));
};
export default ControlsBar;
