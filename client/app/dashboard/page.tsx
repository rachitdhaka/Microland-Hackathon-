"use client";

import { useState } from "react";
import { Navbar } from "@/app/components/dashboard/Navbar";
import { ProjectFeed } from "@/app/components/dashboard/ProjectFeed";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-[1440px] px-8 py-10">
        {/* Page Header */}
        <header className="mb-10 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">
              Available Projects
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your team. Build the future.
            </p>
          </div>
          
          <div className="relative w-full md:max-w-sm lg:max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search by title, role, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-background"
            />
          </div>
        </header>

        {/* Main Grid Area */}
        <section>
          <ProjectFeed searchQuery={searchQuery} />
        </section>
      </main>
    </div>
  );
}