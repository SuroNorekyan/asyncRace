import { Car } from '../types';
import { apiUrl, getJSON } from './base';

export async function getCars(page: number, limit: number) {
  const { data, headers } = await getJSON<Car[]>(apiUrl('/garage', { _page: page, _limit: limit }));
  const total = Number(headers.get('X-Total-Count') ?? '0'); // :contentReference[oaicite:4]{index=4}
  return { data, total };
}

export const getCar = (id: number) => getJSON<Car>(apiUrl(`/garage/${id}`)); // :contentReference[oaicite:5]{index=5}

export async function createCar(input: Omit<Car, 'id'>) {
  const { data } = await getJSON<Car>(apiUrl('/garage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }); // :contentReference[oaicite:6]{index=6}
  return data;
}

export async function updateCar(id: number, input: Omit<Car, 'id'>) {
  const { data } = await getJSON<Car>(apiUrl(`/garage/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }); // :contentReference[oaicite:7]{index=7}
  return data;
}

export async function deleteCar(id: number) {
  await getJSON<unknown>(apiUrl(`/garage/${id}`), { method: 'DELETE' }); // :contentReference[oaicite:8]{index=8}
}
