const BASE_URL = '/api';

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '요청 실패' }));
    throw new Error(error.message);
  }

  const result = await response.json();
  return result.data;
}
