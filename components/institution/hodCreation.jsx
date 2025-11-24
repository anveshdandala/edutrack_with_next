import InputField from "@/components/common/InputField";
import CustomButton from "@/components/common/CustomButton";
import { useState } from "react";

export default function HodCreation() {
  const [hodexists, setHodexists] = useState(false);
  const K_ACCESS = "accesstoken";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hodData, setHodData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    department: "",
    username: "",
    email: "",
    password: "",
  });
  const handleHodInputChange = (field, value) =>
    setHodData((prev) => ({ ...prev, [field]: value }));
  const postHod = async (e) => {
    e.preventDefault();
    console.log("hod details:", hodData);

    setLoading(true);
    setError(null);
    try {
      const access = localStorage.getItem(K_ACCESS);
      console.log("[institutio] access:", access);
      const res = await fetch("http://127.0.0.1:8000/create-hod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify(hodData),
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(json?.detail ?? JSON.stringify(json));
      }

      console.log("HOD created successfully:", json);
      setHodexists(true);
      setHodData({
        first_name: "",
        last_name: "",
        role: "",
        department: "",
        username: "",
        email: "",
        password: "",
      }); // Reset form
    } catch (err) {
      console.error("postHod error:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create-hod mb-6 bg-white/80 backdrop-blur-sm border-b border-portfolio-accent/20">
        {}
        {hodexists ? (
          <div>HOD already exists</div>
        ) : (
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-portfolio-text mb-6">
              Add HOD
            </h2>
            <form onSubmit={postHod} className="space-y-4 max-w-2xl">
              <InputField
                label="First Name"
                placeholder="First Name"
                value={hodData.first_name}
                onChange={(e) =>
                  handleHodInputChange("first_name", e.target.value)
                }
                required
              />
              <InputField
                label="Last Name"
                placeholder="Last Name"
                value={hodData.last_name}
                onChange={(e) =>
                  handleHodInputChange("last_name", e.target.value)
                }
                required
              />
              <InputField
                label="Department"
                placeholder="Department"
                value={hodData.department}
                onChange={(e) =>
                  handleHodInputChange("department", e.target.value)
                }
                required
              />
              <InputField
                label="Role"
                placeholder="Role"
                value={hodData.role}
                onChange={(e) => handleHodInputChange("role", e.target.value)}
                required
              />
              <InputField
                label="Username"
                placeholder="Username"
                value={hodData.username}
                onChange={(e) =>
                  handleHodInputChange("username", e.target.value)
                }
                required
              />
              <InputField
                label="Email"
                placeholder="Email"
                value={hodData.email}
                onChange={(e) => handleHodInputChange("email", e.target.value)}
                required
              />
              <InputField
                label="Password"
                type="password"
                placeholder="Password"
                value={hodData.password}
                onChange={(e) =>
                  handleHodInputChange("password", e.target.value)
                }
                required
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <CustomButton
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Add HOD"}
              </CustomButton>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
