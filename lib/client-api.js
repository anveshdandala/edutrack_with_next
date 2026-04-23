const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export async function clientFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) return null;
  return res.json();
}
