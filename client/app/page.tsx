import Link from "next/link";
import { ArrowRight, Zap, Target, Layers, LayoutDashboard, LogIn, Code2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary flex items-center justify-center rounded-sm">
              <Code2 className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">SkillSync</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-muted-foreground transition-colors flex items-center gap-2">
              <LogIn className="size-4" />
              Login
            </Link>
            <Link href="/dashboard" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-48 flex items-center justify-center border-b border-border overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm mb-8 bg-background">
              <span className="flex size-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Welcome to the 1-bit experience
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl uppercase leading-[0.9] mb-8">
              Build <span className="text-transparent border-text" style={{ WebkitTextStroke: '2px currentColor' }}>Faster.</span><br />
              Ship <span className="underline decoration-4 underline-offset-8">Better.</span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground mb-12 font-medium">
              Microland Hackathon is the ultimate platform for developers to showcase their skills, collaborate on bold ideas, and create high-impact projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-sm border-2 border-primary bg-primary px-8 text-base font-bold text-primary-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_currentColor] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase"
              >
                Join the Hackathon
                <ArrowRight className="ml-2 size-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center rounded-sm border-2 border-border bg-background px-8 text-base font-bold text-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_currentColor] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase"
              >
                View Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Core Principles</h2>
              <div className="h-2 w-24 bg-primary mx-auto mb-6"></div>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Everything you need to accelerate your hackathon journey, stripped down to the absolute essentials.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col p-8 border-2 border-border group hover:border-primary transition-colors bg-card">
                <div className="size-14 bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_currentColor] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                  <Zap className="size-7" />
                </div>
                <h3 className="text-2xl font-bold uppercase mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Optimized for speed and performance. Skip the boilerplate and focus entirely on writing business logic that matters.
                </p>
              </div>
              
              <div className="flex flex-col p-8 border-2 border-border group hover:border-primary transition-colors bg-card">
                <div className="size-14 bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_currentColor] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                  <Target className="size-7" />
                </div>
                <h3 className="text-2xl font-bold uppercase mb-3">Laser Focused</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Zero distractions. The 1-bit monochrome aesthetic removes cognitive load so you can clearly see the structure of your application.
                </p>
              </div>
              
              <div className="flex flex-col p-8 border-2 border-border group hover:border-primary transition-colors bg-card">
                <div className="size-14 bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_currentColor] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                  <Layers className="size-7" />
                </div>
                <h3 className="text-2xl font-bold uppercase mb-3">Highly Composable</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built on rigid standards and reusable components. Snap pieces together seamlessly to form complex architectural layers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Banner CTA */}
        <section className="w-full bg-primary text-primary-foreground py-20 border-y-4 border-foreground dark:border-border">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">Ready to disrupt?</h2>
            <p className="text-primary-foreground/80 max-w-[600px] text-lg mb-10">
              Join hundreds of developers building the next generation of digital infrastructure at Microland Hackathon.
            </p>
            <Link
              href="/signup"
              className="inline-flex h-16 items-center justify-center bg-background px-10 text-lg font-black text-foreground transition-transform hover:scale-105 uppercase"
            >
              Start Building Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-border py-8 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="size-5" />
            <span className="font-bold tracking-tight">MICROLAND</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Microland Hackathon. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="#" className="hover:underline underline-offset-4">Terms</Link>
            <Link href="#" className="hover:underline underline-offset-4">Privacy</Link>
            <Link href="#" className="hover:underline underline-offset-4">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
