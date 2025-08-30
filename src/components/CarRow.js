import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearSelection, selectCar } from '../features/garage/garageSlice';
import { removeCar as removeCarThunk } from '../features/garage/thunks';
import { startCar, stopCar } from '../features/race/runner';
const CarRow = ({ car }) => {
    const dispatch = useAppDispatch();
    const { selectedId } = useAppSelector(s => s.garage);
    const run = useAppSelector(s => s.race.byId[car.id]);
    const global = useAppSelector(s => s.race.global);
    const isSelected = selectedId === car.id;
    const status = run?.status ?? 'idle';
    // race lock: when a global race is running we freeze row actions
    const isRaceLocked = global === 'inProgress';
    // Button enable/disable rules
    const canSelect = !isRaceLocked;
    const canRemove = !isRaceLocked;
    const canStart = !isRaceLocked && status !== 'driving' && global !== 'finished';
    const canStop = !isRaceLocked && !(status === 'idle' || status === 'stopped');
    // Responsive cap so the car never overflows the row
    const [maxPct, setMaxPct] = useState(92); // Desktop
    useEffect(() => {
        const apply = () => {
            const w = window.innerWidth;
            if (w <= 420)
                setMaxPct(80);
            else if (w <= 640)
                setMaxPct(86);
            else
                setMaxPct(92);
        };
        apply();
        window.addEventListener('resize', apply);
        return () => window.removeEventListener('resize', apply);
    }, []);
    const leftPct = ((run?.progress ?? 0) * maxPct).toFixed(3);
    // helper to add a locked style when disabled
    const btnCx = (base, enabled) => clsx(base, !enabled && 'btn--locked');
    // --- tooltips without nested ternaries ---
    const startTitle = (() => {
        if (isRaceLocked)
            return 'Disabled during the race';
        if (status === 'driving')
            return 'Already driving';
        return 'Start';
    })();
    const stopTitle = (() => {
        if (isRaceLocked)
            return 'Disabled during the race';
        if (status === 'idle' || status === 'stopped')
            return 'Car is at start';
        return 'Stop';
    })();
    return (_jsxs("div", { className: "car-row", children: [_jsxs("div", { className: "car-row__top", children: [_jsxs("div", { className: "car-row__buttons", children: [_jsx("button", { type: "button", className: btnCx('btn small', canSelect), disabled: !canSelect, title: isRaceLocked ? 'Disabled during the race' : 'Select', onClick: () => dispatch(isSelected ? clearSelection() : selectCar(car.id)), children: "SELECT" }), _jsx("button", { type: "button", className: btnCx('btn small danger', canRemove), disabled: !canRemove, title: isRaceLocked ? 'Disabled during the race' : 'Remove', onClick: () => dispatch(removeCarThunk(car.id)), children: "REMOVE" }), _jsx("button", { type: "button", className: btnCx('btn small', canStart), disabled: !canStart, title: startTitle, onClick: () => dispatch(startCar(car.id)), "aria-label": "Start engine", children: "Start Engine" }), _jsx("button", { type: "button", className: btnCx('btn small', canStop), disabled: !canStop, title: stopTitle, onClick: () => dispatch(stopCar(car.id)), "aria-label": "Stop engine", children: "Stop Engine" })] }), _jsx("div", { className: "car-row__name", style: { color: car.color }, children: car.name })] }), isRaceLocked && _jsx("div", { className: "race-lock-hint", children: "Disabled during the race" }), _jsx("div", { className: "car-row__track", children: _jsxs("div", { className: "lane", children: [_jsx("div", { className: clsx('car-sprite', status === 'broken' && 'broken'), style: { left: `${leftPct}%`, borderColor: car.color }, children: status === 'broken' && _jsx("div", { className: "car-broken-cross", children: "\u2716" }) }), _jsx("div", { className: "finish-line", style: { right: '10px' } })] }) }), status === 'broken' && _jsx("div", { className: "engine-broke-label", children: "Engine broke" })] }));
};
export default CarRow;
