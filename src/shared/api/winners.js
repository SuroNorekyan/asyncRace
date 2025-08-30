import { apiUrl, getJSON } from './base';
export async function getWinners(page, limit, sort, order) {
    const { data, headers } = await getJSON(apiUrl('/winners', {
        _page: page,
        _limit: limit,
        _sort: sort,
        _order: order.toLowerCase(), // <-- important
    }));
    const total = Number(headers.get('X-Total-Count') ?? '0');
    return { data, total };
}
export const getWinner = (id) => getJSON(apiUrl(`/winners/${id}`));
export async function createWinner(payload) {
    const { data } = await getJSON(apiUrl('/winners'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return data;
}
export async function updateWinner(id, payload) {
    const { data } = await getJSON(apiUrl(`/winners/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return data;
}
export const deleteWinner = (id) => getJSON(apiUrl(`/winners/${id}`), { method: 'DELETE' });
