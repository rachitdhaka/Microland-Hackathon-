"use client";

import { useState } from "react";
import { Navbar } from "../components/dashboard/Navbar";
import { Search, Sparkles, User, ArrowRight, Loader2 } from "lucide-react";

interface MatchedUser {
  _id: string;
  name: string;
  skills: string[];
  bio: string;
  availability: string;
  matchScore: number;
  reasoning: string;
}

export default function AIMatchFinding() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchedUser[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("https://microland-hackathon-1.onrender.com/api/users/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-geist">
      <Navbar />
      
      <main className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
        <div className="space-y-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Matching
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find Your Perfect <br />
            <span className="text-muted-foreground italic">Team Mate</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Describe the person you're looking for, and our AI will scout the community to find the best match for your project.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="relative group max-w-2xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A frontend developer who knows Tailwind CSS and has experience with Framer Motion..."
              className="w-full min-h-[140px] p-6 rounded-2xl bg-background border-2 border-border focus:border-primary outline-none transition-all resize-none text-lg placeholder:text-muted-foreground/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]"
            />
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  Find Matches
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-6">
              <h2 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
                Top Matches
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {results.length} found
                </span>
              </h2>
              {results.map((user) => (
                <div 
                  key={user._id}
                  className="group relative bg-card border border-border rounded-2xl p-6 transition-all hover:border-primary/50 hover:shadow-xl dark:hover:bg-primary/[0.02]"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <p className="text-xs text-muted-foreground">{user.availability}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-secondary text-secondary-foreground border border-border">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        "{user.bio}"
                      </p>

                      <div className="mt-4 p-4 rounded-xl bg-primary/[0.03] border border-primary/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary">
                          <Sparkles className="w-3 h-3" />
                          AI REASONING
                        </div>
                        <p className="text-sm">
                          {user.reasoning}
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-between md:justify-start gap-4 h-full">
                      <div className="text-center md:space-y-1">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Match</div>
                        <div className="text-3xl font-black bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                          {user.matchScore}%
                        </div>
                      </div>
                      
                      <button className="px-6 py-2 rounded-lg border border-primary text-primary text-sm font-bold transition-all hover:bg-primary hover:text-primary-foreground">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && !error && description && (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <h3 className="font-bold text-lg">No perfect matches yet</h3>
              <p className="text-muted-foreground">Try refining your description or searching for different skills.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
