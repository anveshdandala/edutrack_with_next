import { error } from "console";
import { tr } from "date-fns/locale/tr";

const K_ACCESS = "accesstoken";
const K_refresh = "refreshtoken";
export async function login(
  username,
  password,
  { storeRefreshIfReturned = false } = {}
) {
  const res = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = res.json();
  if (!res.ok) {
    throw new Error("fetching access and refresh token failed");
  }
  const { access, refresh } = data;
  if (!access) {
    throw new Error("No access token returned from server.");
  }
  try {
    localStorage.setItem(K_ACCESS, access);
  } catch {}
  // ntk storeRefreshIfReturned
  if (storeRefreshIfReturned && refresh) { 
    try {
      localStorage.setItem(K_refresh, refresh);
    } catch {}
  }
}

export async function ensureAccess() {
  const stored = localStorage.getItem(K_ACCESS);
}

export async function restoreSession() {
  const access = await ensureAccess();
}
