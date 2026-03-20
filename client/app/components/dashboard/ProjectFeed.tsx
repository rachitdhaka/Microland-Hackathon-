"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";

interface UserRef {
  _id: string;
  name: string;
  skills: string[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  requiredRoles: string[];
  creatorId: UserRef;
  teamMembers: UserRef[];
  status: "Open" | "Team Full";
}

export function ProjectFeed({ searchQuery = "" }: { searchQuery?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch("https://microland-hackathon-1.onrender.com/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[280px] bg-muted rounded-xl border border-border"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6">
        <h2 className="font-semibold text-destructive mb-2">System Error</h2>
        <p className="text-sm text-destructive/80 font-mono mb-4">{error}</p>
        <p className="text-sm font-medium text-destructive">Is the backend running on port 5000?</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card">
        <h2 className="font-semibold text-xl mb-2">No Active Projects</h2>
        <p className="text-sm text-muted-foreground mb-6">Be the first to create one.</p>
        <a href="/create-project" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 shadow h-9 px-4 py-2">
          Create Project
        </a>
      </div>
    );
  }

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.requiredRoles.some((role) => role.toLowerCase().includes(q))
    );
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center bg-card">
        <h2 className="font-semibold text-xl mb-2">No Matches Found</h2>
        <p className="text-sm text-muted-foreground">Adjust your filters to see more projects.</p>
      </div>
    );
  }

  const myProjects = filteredProjects.filter(p => p.creatorId?._id === currentUser?._id);
  const otherProjects = filteredProjects.filter(p => p.creatorId?._id !== currentUser?._id);

  return (
    <div className="space-y-12">
      {myProjects.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Our Projects</h2>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                description={project.description}
                requiredRoles={project.requiredRoles}
              />
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {myProjects.length > 0 ? "Other projects" : "All Projects"}
            </h2>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                description={project.description}
                requiredRoles={project.requiredRoles}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
