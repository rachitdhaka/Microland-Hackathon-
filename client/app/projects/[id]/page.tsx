import { Navbar } from "@/app/components/dashboard/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";

interface UserRef {
  _id: string;
  name: string;
  skills: string[];
}

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  requiredRoles: string[];
  creatorId: UserRef;
  teamMembers: UserRef[];
  status: "Open" | "Team Full";
}

async function getProject(id: string): Promise<ProjectData | null> {
  try {
    const res = await fetch(`https://microland-hackathon-1.onrender.com/api/projects/${id}`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch project");
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const isOpen = project.status === "Open";

  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-[1200px] px-8 py-10">
        
        {/* Back Navigation */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl max-w-3xl">
              {project.title}
            </h1>
            <div className="flex-shrink-0 pt-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                isOpen 
                  ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" 
                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Description */}
            <section className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
                <h3 className="font-semibold leading-none tracking-tight text-xl">
                  Brief
                </h3>
              </div>
              <div className="p-6">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </section>

            {/* Call to Action */}
            {isOpen ? (
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-12 px-8 w-full text-lg">
                Apply to Join Team
              </button>
            ) : (
              <div className="flex h-12 w-full items-center justify-center rounded-md border border-input bg-muted px-8 text-lg font-medium text-muted-foreground shadow-sm">
                Team is Full
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Creator Info */}
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Created By
              </h3>
              <p className="font-semibold text-lg mb-3">{project.creatorId?.name || "Unknown User"}</p>
              <div className="flex flex-wrap gap-2">
                {project.creatorId?.skills?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                    {skill}
                  </span>
                ))}
                {(project.creatorId?.skills?.length || 0) > 3 && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                    +{(project.creatorId?.skills?.length || 0) - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Required Roles */}
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Required Roles
              </h3>
              <ul className="flex flex-col gap-2">
                {project.requiredRoles.map((role, idx) => (
                  <li key={idx} className="font-medium text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 6 9 17l-5-5"/></svg>
                    {role}
                  </li>
                ))}
              </ul>
            </div>

            {/* Team Members */}
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Current Roster ({project.teamMembers?.length || 0})
              </h3>
              
              {!project.teamMembers || project.teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No members yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {project.teamMembers.map((member) => (
                    <li key={member._id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="font-semibold text-base mb-1">{member.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {member.skills?.join(" • ") || "No skills listed"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}
