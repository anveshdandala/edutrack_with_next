export async function login(username, password, tenant) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, tenant }),
  });

  const data = await res.json();
  if (!res.ok) {
    // Return the error message from the API
    throw new Error(data.error || "Login failed");
  }
  return data;
}