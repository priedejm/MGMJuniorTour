import { clearStoredAdminKey, getStoredAdminKey, setStoredAdminKey } from "./api-client";

// The admin passcode and the X-Admin-Key header value are the same shared
// secret (VITE_ADMIN_KEY), inlined into the built JS bundle at build time.
// This is intentionally not real security — see server/config.example.php.
const CONFIGURED_KEY = import.meta.env.VITE_ADMIN_KEY as string | undefined;

export function isAdminUnlocked(): boolean {
  const stored = getStoredAdminKey();
  return !!CONFIGURED_KEY && stored === CONFIGURED_KEY;
}

export function unlockAdmin(passcode: string): boolean {
  if (!CONFIGURED_KEY || passcode !== CONFIGURED_KEY) return false;
  setStoredAdminKey(CONFIGURED_KEY);
  return true;
}

export function lockAdmin(): void {
  clearStoredAdminKey();
}
