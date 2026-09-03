import { SystemHealth } from '../types';

const API_BASE = '/api/v1';

export async function fetchHealth(): Promise<SystemHealth> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      status: 'offline',
      project: 'ShramAI',
      version: '0.1.0',
      environment: 'development',
      services: {},
    };
  }
}
