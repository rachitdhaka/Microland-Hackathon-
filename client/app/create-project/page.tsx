"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/dashboard/Navbar";

export default function CreateProjectPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [roleInput, setRoleInput] = useState("");
  const [requiredRoles, setRequiredRoles] = useState<string[]>([]);
  
  const [creatorId, setCreatorId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://microland-hackathon-1.onrender.com/api/users");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            setCreatorId(data.data[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch mock user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleAddRole = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const isEnter = 'key' in e && e.key === "Enter";
    const isBlur = e.type === "blur";
    
    if (isEnter) {
      e.preventDefault();
    }

    if ((isEnter || isBlur) && roleInput.trim()) {
      const newRole = roleInput.trim();
      if (!requiredRoles.includes(newRole)) {
        setRequiredRoles((prev) => [...prev, newRole]);
      }
      setRoleInput("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRequiredRoles((prev) => prev.filter(r => r !== roleToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    if (requiredRoles.length === 0) {
      setError("At least one required role must be specified.");
      return;
    }
    if (!creatorId) {
      setError("System Error: No creator ID found.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        requiredRoles,
        creatorId
      };

      const res = await fetch("https://microland-hackathon-1.onrender.com/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        throw new Error(data.message || "Failed to create project");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-3xl px-6 py-12">
        
        <div className="rounded-xl border border-border shadow-sm bg-card text-card-foreground p-8 md:p-10">
          {/* Page Header */}
          <header className="mb-10 border-b border-border pb-6">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">
              Initiate Project
            </h1>
            <p className="text-lg text-muted-foreground">
              Define the brief. Recruit the team.
            </p>
          </header>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Project Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sentient Toaster App"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Brief / Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the core problem and your proposed hack..."
                rows={6}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-colors"
                disabled={loading}
              />
            </div>

            {/* Dynamic Roles System */}
            <div className="space-y-2">
              <label htmlFor="roles" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Required Roles (Press Enter to add)
              </label>
              
              <input
                id="roles"
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={handleAddRole}
                onBlur={handleAddRole}
                placeholder="e.g. Frontend Engineer..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                disabled={loading}
              />
              
              {/* Roles Chips Box */}
              <div className={`mt-3 min-h-[64px] rounded-md border border-input bg-muted/30 p-4 flex flex-wrap gap-2 content-start transition-colors ${requiredRoles.length === 0 ? '' : 'bg-background hover:bg-muted/10'}`}>
                {requiredRoles.length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    No roles declared yet.
                  </span>
                ) : (
                  requiredRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => removeRole(role)}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground shadow-sm relative group"
                      title="Click to remove"
                    >
                      <span>{role}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-border mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-11 px-8 w-full"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Publish to Network"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
