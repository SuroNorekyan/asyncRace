import { Winner } from '../types';
import { apiUrl, getJSON } from './base';

export async function getWinners(
  page: number,
  limit: number,
  sort: 'id' | 'wins' | 'time',
  order: 'ASC' | 'DESC',
) {
  const { data, headers } = await getJSON<Winner[]>(
    apiUrl('/winners', {
      _page: page,
      _limit: limit,
      _sort: sort,
      _order: order.toLowerCase() as 'asc' | 'desc', // <-- important
    }),
  );
  const total = Number(headers.get('X-Total-Count') ?? '0');
  return { data, total };
}

export const getWinner = (id: number) => getJSON<Winner>(apiUrl(`/winners/${id}`));

export async function createWinner(payload: Winner) {
  const { data } = await getJSON<Winner>(apiUrl('/winners'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updateWinner(id: number, payload: Omit<Winner, 'id'>) {
  const { data } = await getJSON<Winner>(apiUrl(`/winners/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return data;
}

export const deleteWinner = (id: number) =>
  getJSON<unknown>(apiUrl(`/winners/${id}`), { method: 'DELETE' });
