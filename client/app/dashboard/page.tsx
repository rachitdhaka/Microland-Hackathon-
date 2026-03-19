import { Navbar } from "@/app/components/dashboard/Navbar";
import { ProjectFeed } from "@/app/components/dashboard/ProjectFeed";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-[1440px] px-8 py-10">
        {/* Page Header */}
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-2">
            Available Projects
          </h1>
          <p className="text-lg text-muted-foreground">
            Find your team. Build the future.
          </p>
        </header>

        {/* Main Grid Area */}
        <section>
          <ProjectFeed />
        </section>
      </main>
    </div>
  );
}