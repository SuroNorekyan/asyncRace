// src/shared/api/engine.ts
import type { EngineStartResponse } from '../types';
import { apiUrl, getJSON } from './base';

/**
 * Start engine for car id.
 * Backend returns { velocity, distance } for time calculation.
 * Method: PATCH /engine?id=...&status=started
 */
export async function startEngine(id: number): Promise<EngineStartResponse> {
  const { data } = await getJSON<EngineStartResponse>(
    apiUrl('/engine', { id, status: 'started' }),
    { method: 'PATCH' },
  );
  return data;
}

/**
 * Stop engine for car id; puts car back to start.
 * Method: PATCH /engine?id=...&status=stopped
 */
export async function stopEngine(id: number): Promise<unknown> {
  const { data } = await getJSON<unknown>(apiUrl('/engine', { id, status: 'stopped' }), {
    method: 'PATCH',
  });
  return data;
}

/**
 * Engage driving mode; may respond 200 {success:true} or 500 error.
 * Method: PATCH /engine?id=...&status=drive
 */
export async function drive(id: number): Promise<{ success: boolean }> {
  const { data } = await getJSON<{ success: boolean }>(apiUrl('/engine', { id, status: 'drive' }), {
    method: 'PATCH',
  });
  return data;
}
