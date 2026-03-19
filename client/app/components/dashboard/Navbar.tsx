"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Create Project", href: "/create-project" },
    { name: "AI Mate Finding", href: "/ai-match" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-[1440px] px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="font-geist font-bold tracking-tight text-lg">
          <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
            Microland
          </Link>
        </div>

        {/* Navigation & Theme Toggle */}
        <div className="flex items-center gap-6">
          <div className="flex gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-border bg-background"
              title="Toggle Theme"
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
