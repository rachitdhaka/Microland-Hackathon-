"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/app/components/dashboard/Navbar";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("Not specified");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(
        "https://microland-hackathon-1.onrender.com/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) {
        const user = data.data;
        setName(user.name || "");
        setEmail(user.email || "");
        setBio(user.bio || "");
        setSkills(user.skills ? user.skills.join(", ") : "");
        setAvailability(user.availability || "Not specified");
        setNumber(user.number || "");
      } else {
        setError("Failed to load profile.");
      }
    } catch (err) {
      setError("An error occurred while fetching profile.");
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const token = localStorage.getItem("token");
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    try {
      const res = await fetch(
        "https://microland-hackathon-1.onrender.com/api/users/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            bio,
            skills: skillsArray,
            availability,
            number,
          }),
        },
      );

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Update local storage user if needed
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, ...data.data }),
        );
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse font-medium">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-4xl p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <aside className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your public information and skills.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <span className="text-3xl font-bold text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-lg">{name}</h2>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive py-3 px-4 text-sm font-semibold transition-all hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut size={16} />
              Logout from account
            </button>
          </aside>

          <section>
            <div className="rounded-xl border border-border shadow-sm bg-card text-card-foreground p-8 md:p-10">
              {error && (
                <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 rounded-md border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-600 font-medium">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="number"
                      className="text-sm font-medium leading-none"
                    >
                      Phone Number
                    </label>
                    <input
                      id="number"
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium leading-none"
                  >
                    Short Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="skills"
                    className="text-sm font-medium leading-none"
                  >
                    Skills (comma separated)
                  </label>
                  <input
                    id="skills"
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Python, Figma..."
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Help our AI match you with the right projects
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="availability"
                    className="text-sm font-medium leading-none"
                  >
                    Availability
                  </label>
                  <select
                    id="availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Not specified">Select Availability</option>
                    <option value="Full-time">Full-time (40+ hrs/week)</option>
                    <option value="Part-time">Part-time (20 hrs/week)</option>
                    <option value="Weekends only">Weekends only</option>
                    <option value="Available soon">Available soon</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-11 px-8 w-fit"
                >
                  {loading ? "Saving Changes..." : "Save Profile"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
