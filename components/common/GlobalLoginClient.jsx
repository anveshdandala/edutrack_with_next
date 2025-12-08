// components/common/GlobalLoginClient.jsx
"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Building2, Loader2, Search } from "lucide-react";

export default function GlobalLoginClient({ colleges = [] }) {
  const router = useRouter();
  
  // State
  const [open, setOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Refs for click outside
  const dropdownRef = useRef(null);

  // Filter colleges based on search
  const filteredColleges = useMemo(() => {
    if (!searchQuery) return colleges;
    return colleges.filter((college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [colleges, searchQuery]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async () => {
    if (!selectedCollege) return;

    setLoading(true);
    try {
      const res = await fetch("/api/select-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema: selectedCollege.schema_name,
          name: selectedCollege.name,
        }),
      });

      if (!res.ok) throw new Error("Failed to select tenant");

      router.push(`/${selectedCollege.schema_name}/auth/login`);
    } catch (err) {
      console.error("selectTenant error:", err);
      alert("Failed to select institution. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome to EduTrack
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Select your institution to access your dashboard
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-10 space-y-4">
          
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              Select Institution
            </label>
            
            {/* The Trigger Button */}
            <button
              onClick={() => setOpen(!open)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left border rounded-xl transition-all duration-200 outline-none
                ${open ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200 hover:border-gray-300'}
                ${!selectedCollege ? 'text-gray-500' : 'text-gray-900 font-medium'}
              `}
            >
              <span className="truncate">
                {selectedCollege ? selectedCollege.name : "Search for your college..."}
              </span>
              <ChevronsUpDown className="w-4 h-4 text-gray-400 opacity-50 ml-2 flex-shrink-0" />
            </button>

            {/* The Dropdown Menu */}
            {open && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {/* Search Input */}
                <div className="flex items-center border-b px-3 py-2 bg-gray-50/50">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 text-gray-700"
                    placeholder="Type to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* List Items */}
                <div className="max-h-[240px] overflow-y-auto p-1">
                  {filteredColleges.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No colleges found.
                    </div>
                  ) : (
                    filteredColleges.map((college) => (
                      <button
                        key={college.id}
                        onClick={() => {
                          setSelectedCollege(college);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors
                          ${selectedCollege?.id === college.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}
                        `}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 transition-opacity ${
                            selectedCollege?.id === college.id ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <span className="truncate text-left">{college.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleSelect}
            disabled={!selectedCollege || loading}
            className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200
              ${!selectedCollege || loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98]'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Continue to Portal"
            )}
          </button>

        </div>
        
        {/* Footer decoration */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Protected by EduTrack Secure Login
          </p>
        </div>
      </div>
    </div>
  );
}