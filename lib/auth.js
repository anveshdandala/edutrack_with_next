const API_URL = "http://127.0.0.1:8000"; // Change this if deployed
const K_ACCESS = "accesstoken";
const K_REFRESH = "refreshtoken";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.detail || JSON.stringify(data);
    throw new Error(errorMsg || "Request failed");
  }
  return data;
}

// --- AUTH ACTIONS ---

export async function register(username, email, password, re_password) {
  const res = await fetch(`${API_URL}/auth/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, re_password }),
  });
  return handleResponse(res);
}

export async function login(username, password) {
  // 1. Get Tokens
  const res = await fetch(`${API_URL}/auth/jwt/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await handleResponse(res); // FIXED: Added await here
  const { access, refresh } = data;

  if (!access) throw new Error("No access token returned.");

  // 2. Store Tokens
  if (typeof window !== "undefined") {
    localStorage.setItem(K_ACCESS, access);
    if (refresh) localStorage.setItem(K_REFRESH, refresh);
  }

  // 3. Fetch User Profile immediately so we know WHO logged in
  return await fetchUserMe(access);
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(K_ACCESS);
    localStorage.removeItem(K_REFRESH);
    // Optional: Call backend logout if using blacklisting, generally not needed for stateless JWT
  }
}

// --- HELPERS & SESSION RESTORATION ---

export async function fetchUserMe(token) {
  const res = await fetch(`${API_URL}/auth/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // Token likely expired
    throw new Error("Token invalid or expired");
  }

  return await res.json(); // Returns { id, username, email, ... }
}

export async function restoreSession() {
  if (typeof window === "undefined") return { user: null };

  const access = localStorage.getItem(K_ACCESS);
  if (!access) return { user: null };

  try {
    const user = await fetchUserMe(access);
    return { user };
  } catch (err) {
    // If access token failed, you could try to refresh here (advanced)
    // For now, we assume session is dead
    console.log("Session restore failed:", err);
    return { user: null };
  }
}

export function getStoredUser() {
  // This is just for initial state, but usually better to start null
  // and let useEffect call restoreSession
  return null;
}
