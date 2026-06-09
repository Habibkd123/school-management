// ─── Token Storage Helpers (localStorage + Cookie) ───────────────
// localStorage: client-side access ke liye
// Cookie: middleware (server-side) routing ke liye

const KEYS = {
  ACCESS_TOKEN: "sm_access_token",
  REFRESH_TOKEN: "sm_refresh_token",
  USER: "sm_user",
} as const;

// Cookie max-age: 15 minutes (same as JWT_ACCESS_EXPIRY)
const COOKIE_MAX_AGE = 60 * 15;

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  school_id: string | null;
}

// ─── Cookie helpers ───────────────────────────────────────────────
function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── Save ─────────────────────────────────────────────────────────
export const saveSession = (
  accessToken: string,
  refreshToken: string,
  user: StoredUser
) => {
  // localStorage (client use karta hai)
  localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(KEYS.USER, JSON.stringify(user));

  // Cookie (middleware read karta hai)
  setCookie(KEYS.ACCESS_TOKEN, accessToken, COOKIE_MAX_AGE);
};

// ─── Load ─────────────────────────────────────────────────────────
export const getAccessToken = (): string | null =>
  localStorage.getItem(KEYS.ACCESS_TOKEN);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(KEYS.REFRESH_TOKEN);

export const getStoredUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
};

// ─── Clear ────────────────────────────────────────────────────────
export const clearSession = () => {
  localStorage.removeItem(KEYS.ACCESS_TOKEN);
  localStorage.removeItem(KEYS.REFRESH_TOKEN);
  localStorage.removeItem(KEYS.USER);

  // Cookie bhi clear karo taake middleware redirect kare
  deleteCookie(KEYS.ACCESS_TOKEN);
};

// ─── Auth Header Helper ───────────────────────────────────────────
export const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
