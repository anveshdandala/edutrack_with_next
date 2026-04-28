import { headers } from "next/headers";
import { serverFetch } from "@/lib/server-api";
import Link from "next/link";
import { Plus, FileText, ChevronRight } from "lucide-react";
import StudentShell from "@/components/student/StudentShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function ResumePage() {
    const headerList = await headers();
    const tenant = headerList.get("x-tenant");

    // Fetch the list of resumes
    const resumes = await serverFetch("/resume/resume/", { tenant }) || [];

    return (
        <StudentShell>
            <div className="space-y-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">My Resumes</h1>
                        <p className="text-sm text-muted-foreground">Manage and edit your tailored resumes.</p>
                    </div>
                    <Button asChild>
                        <Link href="/student/resume/generate" className="gap-2">
                            <Plus className="size-4" />
                            <span>Create New Resume</span>
                        </Link>
                    </Button>
                </header>

                {resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed bg-card p-12 text-center">
                        <div className="mb-6 flex size-20 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <FileText className="size-9" />
                        </div>
                        <h2 className="mb-3 text-xl font-semibold">No Resumes Found</h2>
                        <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
                            You haven't created any tailored resumes yet. Start by creating your first one to apply for jobs.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/student/resume/generate" className="gap-2">
                                <Plus className="size-4" />
                                <span>Create Now</span>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {resumes.map((resume) => (
                            <Link 
                                href={`/student/resume/${resume.id}/edit`} 
                                key={resume.id}
                                className="group block h-full outline-none"
                            >
                                <div className="flex h-full flex-col rounded-md border bg-card p-5 transition-colors group-hover:bg-accent group-focus-visible:ring-2 group-focus-visible:ring-ring">
                                    <div className="mb-5 flex items-start justify-between">
                                        <div className="rounded-md bg-primary/10 p-3 text-primary">
                                            <FileText className="size-5" />
                                        </div>
                                        <Badge variant="secondary" className="uppercase">
                                            {resume.template_style || 'Default'}
                                        </Badge>
                                    </div>
                                    
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {resume.title || `Resume #${resume.id}`}
                                    </h3>
                                    
                                    <p className="mb-8 line-clamp-3 flex-grow text-sm leading-relaxed text-muted-foreground">
                                        {resume.job_description || 'No description provided.'}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between border-t pt-4">
                                        <span className="text-xs font-medium text-muted-foreground">ID: {resume.id}</span>
                                        <div className="flex items-center text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                                            <span>Edit Resume</span>
                                            <ChevronRight className="ml-1 size-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </StudentShell>
    );
}
