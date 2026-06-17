// ─── Token Storage Helpers (localStorage) ────────────────────────
// Ye helpers browser mein access_token aur refresh_token save/load karte hain

const KEYS = {
  ACCESS_TOKEN: "sm_access_token",
  REFRESH_TOKEN: "sm_refresh_token",
  USER: "sm_user",
} as const;

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  school_id: string | null;
  must_change_password?: boolean;
}

// ─── Save ─────────────────────────────────────────────────────────
export const saveSession = (
  accessToken: string,
  refreshToken: string,
  user: StoredUser
) => {
  localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
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
};

// ─── Update must_change_password flag only ────────────────────────
export const clearMustChangePassword = () => {
  const user = getStoredUser();
  if (!user) return;
  localStorage.setItem(KEYS.USER, JSON.stringify({ ...user, must_change_password: false }));
};

// ─── Auth Header Helper ───────────────────────────────────────────
export const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
