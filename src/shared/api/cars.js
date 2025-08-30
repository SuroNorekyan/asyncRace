import { apiUrl, getJSON } from './base';
export async function getCars(page, limit) {
    const { data, headers } = await getJSON(apiUrl('/garage', { _page: page, _limit: limit }));
    const total = Number(headers.get('X-Total-Count') ?? '0'); // :contentReference[oaicite:4]{index=4}
    return { data, total };
}
export const getCar = (id) => getJSON(apiUrl(`/garage/${id}`)); // :contentReference[oaicite:5]{index=5}
export async function createCar(input) {
    const { data } = await getJSON(apiUrl('/garage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    }); // :contentReference[oaicite:6]{index=6}
    return data;
}
export async function updateCar(id, input) {
    const { data } = await getJSON(apiUrl(`/garage/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    }); // :contentReference[oaicite:7]{index=7}
    return data;
}
export async function deleteCar(id) {
    await getJSON(apiUrl(`/garage/${id}`), { method: 'DELETE' }); // :contentReference[oaicite:8]{index=8}
}
