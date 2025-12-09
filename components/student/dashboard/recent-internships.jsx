
import { Briefcase } from "lucide-react";
import Link from "next/link";

// Mock data to replace hardcoded JSX. 
// In the future, fetch this from /api/internships/ or similar.
const MOCK_INTERNSHIPS = [
  {
    id: 101,
    title: "Data Science Intern",
    company: "Spotify",
    location: "New York (Remote)",
    logoBg: "bg-black",
    logoColor: "bg-blue-500", // simulated logo dot
    tags: ["Python", "ML"],
  },
  {
    id: 102,
    title: "Backend Developer",
    company: "TechCorp",
    location: "Hyderabad",
    logoBg: "bg-blue-600",
    logoText: "T",
    tags: ["Django"],
  },
];

export default async function RecentInternships({ tenant }) {
  // Simulate network delay if needed, or just render.
  // const data = await fetchInternships(tenant); 
  const internships = MOCK_INTERNSHIPS;

  return (
    <div>
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Briefcase className="text-blue-600" size={20} /> Internships
        </h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {internships.map((intern) => (
                <div key={intern.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${intern.logoBg} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                            {intern.logoText ? intern.logoText : (
                                <div className={`w-7 h-7 rounded-full ${intern.logoColor}`}></div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                                {intern.title}
                            </h4>
                            <p className="text-sm text-gray-500">{intern.company} • {intern.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex gap-2">
                            {intern.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <Link 
                            href={`/${tenant}/internships`}
                            className="px-4 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
