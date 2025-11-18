"use client";
import { useState, useEffect, use } from "react";
import CustomButton from "@/components/common/CustomButton";
import { da } from "date-fns/locale";
// We've moved the LoginForm component into this file to resolve the import error.
function LoginForm({ onLogin }) {
  // We prevent the form's default behavior and call the passed function instead
  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
  };
  const [jwt, setJwt] = useState(null);

  const username = "admin";
  const password = "test";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/auth/jwt/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Login failed: ${errText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("refresh and access tokens:", data);
        setJwt(data);
      })
      .catch((err) => console.error(err));
  }, [username, password]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-[#0069c7] hover:text-indigo-500"
            >
              Forgot Password?
            </a>
          </div>
        </div>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="re-password"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
        </div>
        <div className="mt-1">
          <input
            id="re-password"
            name="re-password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <CustomButton
          type="submit"
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Continue
        </CustomButton>
      </div>
    </form>
  );
}

function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");
  const [selectedRole, setSelectedRole] = useState("student"); // Default role

  // This function is now called by the button in the LoginForm
  const handleLogin = () => {
    // Navigate to the page corresponding to the currently selected role
    if (selectedRole) {
      // Replaced Next.js router with standard browser navigation
      window.location.href = `/${selectedRole}`;
    }
  };

  const roles = ["student", "faculty", "institution"];

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
      <div className="text-center">
        <div className="flex justify-center mb-4"></div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please select your role and sign in to continue.
        </p>
      </div>

      {activeTab === "login" && (
        <>
          {/* Custom styled radio buttons for role selection */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-200 rounded-lg">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full px-4 py-2 text-sm font-semibold text-center capitalize transition-colors duration-200 rounded-md ${
                  selectedRole === role
                    ? "bg-[#0069c7] text-white shadow"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <LoginForm onLogin={handleLogin} />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              New user?{" "}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => setActiveTab("signup")}
              >
                Sign up here
              </button>
            </p>
          </div>
        </>
      )}

      {activeTab === "signup" && (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Sign Up Form</h2>
          <p className="text-gray-600">
            Your sign-up form component would go here.
          </p>
          <button
            className="mt-4 font-medium text-indigo-600 hover:text-indigo-500"
            onClick={() => setActiveTab("login")}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}

// Parent container to center everything on the page
export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <AuthTabs />
    </div>
  );
}
