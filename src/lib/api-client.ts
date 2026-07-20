const ADMIN_KEY_STORAGE_KEY = "mgm-admin-key";

export function getStoredAdminKey(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_KEY_STORAGE_KEY);
}

export function setStoredAdminKey(key: string): void {
  sessionStorage.setItem(ADMIN_KEY_STORAGE_KEY, key);
}

export function clearStoredAdminKey(): void {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data && typeof data.error === "string" ? data.error : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export async function apiGet<T>(path: string, admin = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (admin) headers["X-Admin-Key"] = getStoredAdminKey() ?? "";
  const res = await fetch(path, { headers });
  return parseResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown, admin = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (admin) headers["X-Admin-Key"] = getStoredAdminKey() ?? "";
  const res = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return parseResponse<T>(res);
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = { "X-Admin-Key": getStoredAdminKey() ?? "" };
  const res = await fetch(path, { method: "POST", headers, body: formData });
  return parseResponse<T>(res);
}
