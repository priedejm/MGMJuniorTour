import { apiGet, apiPost } from "./api-client";

// Admin auth is a server-side PHP session (see server/login.php,
// server/lib/auth.php). The browser never holds the shared secret —
// it posts the typed passcode once and the server decides.
export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await apiGet<{ authenticated: boolean }>("/whoami.php");
    return res.authenticated;
  } catch {
    return false;
  }
}

export async function loginAdmin(passcode: string): Promise<boolean> {
  try {
    await apiPost<{ ok: true }>("/login.php", { passcode });
    return true;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await apiPost<{ ok: true }>("/logout.php", {});
  } catch {
    // Best-effort — the client-side state resets regardless.
  }
}
