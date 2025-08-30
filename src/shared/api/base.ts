import { qs } from '../lib/qs';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000';

export const apiUrl = (path: string, params?: Record<string, string | number | undefined>) =>
  `${API_BASE}${path}${params ? qs(params) : ''}`;

export type FetchResult<T> = { data: T; headers: Headers };

export async function getJSON<T>(url: string, init?: RequestInit): Promise<FetchResult<T>> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}
