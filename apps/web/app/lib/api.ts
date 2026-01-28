const base = process.env.NEXT_PUBLIC_API_URL;
export const apiUrl = base && base.length > 0 ? base : "/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ac_token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("ac_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("ac_token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
