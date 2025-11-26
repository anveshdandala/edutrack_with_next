const API_URL = "http://127.0.0.1:8000"; // change when deployed
const K_ACCESS = "accesstoken";
const K_REFRESH = "refreshtoken";

async function handleResponse(res) {
  // read text first (safe)
  const text = await res.text().catch(() => "");
  const contentType = (res.headers.get("content-type") || "").toLowerCase();

  // try parse JSON only if content-type looks like JSON, otherwise keep raw text
  let data = {};
  if (text) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        // malformed JSON — return raw text + marker
        data = { _raw: text, _parseError: true };
      }
    } else {
      // non-JSON response (HTML error page, etc)
      data = { _raw: text, _nonJsonResponse: true };
    }
  }

  if (!res.ok) {
    const errorMsg =
      (data && (data.detail || data.error || data.message)) ||
      `${res.status} ${res.statusText}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}
//need to be checked
export async function activateUser(uid, token) {
  const url = `${API_URL}/activate/${encodeURIComponent(
    uid
  )}/${encodeURIComponent(token)}/`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
}

export async function register(username, email, password, re_password) {
  const res = await fetch(`${API_URL}/auth/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, re_password }),
  });
  return handleResponse(res);
}

// succes
export async function login(username, password) {
  console.log("[auth] login called");
  const res = await fetch(`${API_URL}/auth/jwt/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res);

  const { access, refresh } = data;
  if (!access) throw new Error("No access token returned.");

  // storing refresh in localStorage is risky
  if (typeof window !== "undefined") {
    localStorage.setItem(K_ACCESS, access);
    if (refresh) localStorage.setItem(K_REFRESH, refresh);
  }
  const user = await fetchUserMe(access);
  console.log("[auth] login output", user);
  return user;
}

export async function logout() {
  // Inform backend if needed (blacklist refresh token), then clear client tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem(K_ACCESS);
    localStorage.removeItem(K_REFRESH);
  }
  // Optionally call logout endpoint to invalidate refresh token server-side:
  // await fetch(`${API_URL}/auth/logout/`, { method: "POST", credentials: "include" });
}
let refreshPromise = null;

export async function fetchUserMe(token) {
  const res = await fetch(`${API_URL}/auth/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    const payload = errText ? JSON.parse(errText) : {};
    const err = new Error("Token invalid or expired");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  //currently we get {"email": "user@example.com","id": 0,"username": "string"}

  const fetchedData = await res.json();

  return fetchedData;
}

async function doRefresh(refreshToken) {
  // return the new access token (string)
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/jwt/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // If you store refresh in cookie, you don't need to include it in body and should use credentials: 'include'
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const data = await handleResponse(res);
  // typical response: { access: "..." }
  if (!data.access) throw new Error("Refresh did not return new access token");
  if (typeof window !== "undefined") {
    localStorage.setItem(K_ACCESS, data.access);
    if (data.refresh) localStorage.setItem(K_REFRESH, data.refresh); // if backend rotates refresh
  }
  return data.access;
}

export async function restoreSession() {
  if (typeof window === "undefined") return { user: null };
  const access = localStorage.getItem(K_ACCESS);
  const refresh = localStorage.getItem(K_REFRESH);

  if (!access && !refresh) return { user: null };

  if (access) {
    try {
      const user = await fetchUserMe(access);
      return { user };
    } catch (err) {}
  }

  try {
    if (!refresh) throw new Error("No refresh token available");

    if (!refreshPromise) {
      refreshPromise = doRefresh(refresh).finally(() => {
        refreshPromise = null;
      });
    }
    const newAccess = await refreshPromise;
    const user = await fetchUserMe(newAccess);
    return { user };
  } catch (err) {
    // Refresh failed — clear tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem(K_ACCESS);
      localStorage.removeItem(K_REFRESH);
    }
    return { user: null };
  }
}

// ---------- fetch wrapper that auto-refreshes on 401 ----------

/**
 * fetchWithAuth(url, opts)
 * - adds Authorization header
 * - retries once after refresh if 401
 */
export async function fetchWithAuth(input, init = {}) {
  if (typeof window === "undefined")
    throw new Error("fetchWithAuth can only run in browser");

  let access = localStorage.getItem(K_ACCESS);
  const opts = {
    ...init,
    headers: { ...(init.headers || {}), "Content-Type": "application/json" },
  };

  if (access) opts.headers.Authorization = `Bearer ${access}`;

  let res = await fetch(input, opts);
  if (res.status !== 401) return handleResponse(res);

  // If 401: try to refresh once
  const refresh = localStorage.getItem(K_REFRESH);
  if (!refresh) {
    // no refresh available — clear state & throw
    localStorage.removeItem(K_ACCESS);
    localStorage.removeItem(K_REFRESH);
    throw new Error("Unauthorized and no refresh token");
  }

  try {
    // avoid race condition using refreshPromise
    if (!refreshPromise) {
      refreshPromise = doRefresh(refresh).finally(() => {
        refreshPromise = null;
      });
    }
    const newAccess = await refreshPromise;

    // retry original request with new access
    opts.headers.Authorization = `Bearer ${newAccess}`;
    res = await fetch(input, opts);
    return handleResponse(res);
  } catch (err) {
    localStorage.removeItem(K_ACCESS);
    localStorage.removeItem(K_REFRESH);
    throw new Error("Session expired; please log in again");
  }
}

export function getStoredUser() {
  // If you store a serialized user in localStorage, return it here.
  // Currently we don't persist user object, so return null.
  // Optionally you can store user on login and return that cached object.
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("user_profile") : null;
  return raw ? JSON.parse(raw) : null;
}
