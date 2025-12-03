import { AuthProvider } from "@/components/AuthProvider";
import { serverFetch } from "@/lib/server-api";
// import Navbar from "@/components/Navbar"; // Example

export default async function TenantLayout({ children, params }) {
  const { tenant } = await params;

  // 1. Fetch User Data on the Server
  // This uses your 'serverFetch' helper to read the HttpOnly cookie
  // and talk to Django securely.
  let user = null;
  try {
    user = await serverFetch("/auth/users/me/", {
      tenant,
      cache: "no-store",
    });
    console.log(`[Server] User logged in as: ${user?.username}  ${user?.role}`); //logging
  } catch (error) {
    // If 401/403, user is null. That's fine, we just render as guest/logged out.
    console.log("[Server] User is not logged in (Guest)");
  }

  return (
    // 2. Pass the fetched user to the Client Provider
    <AuthProvider initialUser={user}>
      <div className="min-h-screen flex flex-col">
        {/* <Navbar user={user} />  <-- You can now pass user to server components too! */}

        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
