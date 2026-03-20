"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/app/components/dashboard/Navbar";
import { PeopleCard } from "@/app/components/dashboard/PeopleCard";
import { Search, Users as UsersIcon } from "lucide-react";

interface User {
  _id: string;
  name: string;
  bio: string;
  skills: string[];
  availability: string;
  email: string;
  number?: string;
}

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://microland-hackathon-1.onrender.com/api/users");
        if (!res.ok) throw new Error("Failed to fetch developers");
        
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.bio && u.bio.toLowerCase().includes(q)) ||
      (u.skills && u.skills.some((skill) => skill.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        {/* Page Header */}
        <header className="mb-10 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <UsersIcon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-1">
                People
              </h1>
              <p className="text-lg text-muted-foreground italic">
                Connect with fellow hackers & builders.
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:max-w-sm lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name, skills, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-12 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-background hover:border-muted-foreground/30 focus:border-primary/50"
            />
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-muted/50 rounded-xl border border-border"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-8 text-center max-w-2xl mx-auto">
            <h2 className="font-bold text-destructive text-xl mb-2">Connection Issues</h2>
            <p className="text-sm text-destructive/80 font-mono mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty States */}
        {!loading && !error && users.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-16 text-center flex flex-col items-center justify-center bg-card shadow-sm">
            <UsersIcon size={48} className="text-muted-foreground/30 mb-4" />
            <h2 className="font-semibold text-2xl mb-2">No Builders Found</h2>
            <p className="text-muted-foreground max-w-md">It seems like there are no active developers in the network yet.</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
              <span>Showing {filteredUsers.length} developer{filteredUsers.length !== 1 ? 's' : ''}</span>
            </div>

            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <PeopleCard
                    key={user._id}
                    name={user.name}
                    bio={user.bio}
                    skills={user.skills}
                    availability={user.availability}
                    email={user.email}
                    number={user.number}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-16 text-center flex flex-col items-center justify-center bg-card shadow-sm">
                <Search size={48} className="text-muted-foreground/30 mb-4" />
                <h2 className="font-semibold text-2xl mb-2">No Matches Found</h2>
                <p className="text-muted-foreground">Try searching for different skills or names.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
