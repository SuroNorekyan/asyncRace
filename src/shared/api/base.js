import { qs } from '../lib/qs';
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000';
export const apiUrl = (path, params) => `${API_BASE}${path}${params ? qs(params) : ''}`;
export async function getJSON(url, init) {
    const res = await fetch(url, init);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }
    const data = (await res.json());
    return { data, headers: res.headers };
}
