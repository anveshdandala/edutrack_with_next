"use client";
import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function ApiTesting() {
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [users, setUsers] = useState([{}]);

  const formatErrors = (errObj) => {
    if (typeof errObj === "object" && errObj !== null) {
      return Object.entries(errObj)
        .map(
          ([field, val]) =>
            `${field}: ${Array.isArray(val) ? val.join(" ") : String(val)}`
        )
        .join(" | ");
    }
    return String(errObj);
  };

  async function getJwt({ username, password }) {
    const res = await fetch(`${API}/auth/jwt/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setJwt(data.access);
      try {
        if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      } catch {}
      setMsg("Logged in successfully.");
    } else {
      setJwt(null);
      setMsg(`JWT failed: ${formatErrors(data)}`);
    }
    return res.ok;
  }

  async function createUser({ email, username, password, re_password }) {
    const res = await fetch(`${API}/auth/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, re_password }),
    });
    const data = await res.json();
    console.log("okay response ", res.ok);
    console.log("data response ", data);
    return { ok: res.ok, status: res.status, data };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setJwt(null);

    // Read fresh values directly from the form (avoids stale state)
    const email = e.currentTarget.user_email.value.trim();
    const username = e.currentTarget.user_username.value.trim();
    const password = e.currentTarget.user_password.value;
    const re_password = e.currentTarget.user_re_password.value;

    console.log(email, username, password, re_password);

    try {
      const result = await createUser({
        email,
        username,
        password,
        re_password,
      });

      if (result.ok) {
        setMsg("User created. Logging in…");
        await getJwt({ username, password });
      } else {
        // If user already exists, skip create and try login
        if (result.status === 400 && result.data?.username) {
          setMsg("User exists. Trying to log in…");
          await getJwt({ username, password });
        } else {
          setMsg(`Signup failed: ${formatErrors(result.data)}`);
        }
      }
    } catch (err) {
      setMsg(`Unexpected error: ${err?.message ?? err}`);
    } finally {
      setLoading(false);
    }
  }

  async function onLoginClick(e) {
    e.preventDefault(); // prevent form submit
    const username = e.currentTarget.form.user_username.value.trim();
    const password = e.currentTarget.form.user_password.value;
    setMsg("Logging in…");
    await getJwt({ username, password });
  }

  async function getusers() {
    const response = await fetch(`${API}/auth/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    const data = await response.json(); // await it properly because itt is a promisee

    if (response.ok) {
      setUsers(data);
      console.log("available users:", data);
    } else {
      console.error("Error fetching users:", data);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Create & Login (No useEffect)</h2>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="border rounded p-2"
          id="email"
          name="user_email"
          type="email"
          required
        />

        <label htmlFor="username">Username</label>
        <input
          className="border rounded p-2"
          id="username"
          name="user_username"
          type="text"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className="border rounded p-2"
          id="password"
          name="user_password"
          type="password"
          required
        />

        <label htmlFor="re_password">Confirm Password</label>
        <input
          className="border rounded p-2"
          id="re_password"
          name="user_re_password"
          type="password"
          required
        />

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="border rounded p-2"
            disabled={loading}
          >
            {loading ? "Working…" : "Create User & Auto Login"}
          </button>

          {/* Separate login button that does NOT submit the form */}
          <button
            type="button"
            className="border rounded p-2"
            onClick={onLoginClick}
          >
            Get JWT Only
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm">{msg}</p>
        <p className="break-all mt-2">{jwt ? `JWT: ${jwt}` : "No JWT yet"}</p>
      </div>

      <div className="available-users flex flex-col border rounded p-3 w-1/2">
        <button className="border rounded p-2" onClick={getusers}>
          show avalable users
        </button>
        <div className="details flex flex-wrap">
          <div className="indi-block border rounded p-2">
            {users.map((user) => (
              <li key={user.id}>
                {user.username} ({user.email})
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
