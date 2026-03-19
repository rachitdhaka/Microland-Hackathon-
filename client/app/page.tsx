"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [showIntro, setShowIntro] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [storedUser, setStoredUser] = useState({ username: "user", password: "password" });

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const simulateLoad = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => {
      cb();
      setLoading(false);
    }, 1200);
  };

  const handleLogin = () => {
    if (username === storedUser.username && password === storedUser.password) {
      simulateLoad(() => setIsAuth(true));
    } else alert("Invalid credentials");
  };

  const handleRegister = () => {
    setStoredUser({ username, password });
    alert("Registered! Please login");
    setIsLogin(true);
  };

  // ================= INTRO =================
  if (showIntro) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-4xl font-bold tracking-widest"
          style={{ textShadow: "0 0 20px #818CF8" }}
        >
          WELCOME TO TEAM BUILDER
        </motion.h1>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ================= AUTH =================
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white"
        style={{ background: "radial-gradient(circle at top, #1a1a2e, #0B0B0F)" }}>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          className="w-96 p-8 rounded-2xl backdrop-blur-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 0 60px rgba(129,140,248,0.25)" }}>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button onClick={isLogin ? handleLogin : handleRegister} className="btn">
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="text-center mt-4 text-sm">
            <span onClick={() => setIsLogin(!isLogin)} className="cursor-pointer text-purple-400">
              {isLogin ? "Create Account" : "Back to Login"}
            </span>
          </p>
        </motion.div>

        <style jsx>{`
          .input { width:100%; padding:12px; margin-bottom:12px; border-radius:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);} 
          .btn { width:100%; padding:12px; border-radius:12px; font-weight:600; background:linear-gradient(135deg,#818CF8,#C084FC);} 
        `}</style>
      </div>
    );
  }

  // ================= DASHBOARD =================
  return (
    <div className="flex h-screen text-white" style={{ background: "#0B0B0F" }}>

      {/* Sidebar */}
      <motion.div initial={{ x: -80 }} animate={{ x: 0 }} className="w-64 p-6"
        style={{ background: "rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>

        <h1 className="text-xl font-bold mb-8 text-indigo-400">TeamBuilder AI</h1>

        {["Dashboard", "Team Discovery", "Match Engine", "Invitations"].map((item, i) => (
          <div key={i} className="p-3 rounded-lg hover:bg-white/10 hover:scale-105 transition cursor-pointer">
            {item}
          </div>
        ))}

        <button onClick={() => setIsAuth(false)} className="mt-10 text-red-400">Logout</button>
      </motion.div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <input
            placeholder="Search talent..."
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 w-1/3"
          />

          <div className="flex items-center gap-4">
            <span className="text-sm bg-purple-500/30 px-3 py-1 rounded">Analyzing</span>
            <img src="https://i.pravatar.cc/40" className="rounded-full" />
          </div>
        </div>

        {/* Prompt */}
        <div className="p-6 rounded-2xl mb-6 backdrop-blur-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h2 className="text-xl">“Need a React & Node dev for fintech.”</h2>
        </div>

        {/* Candidates */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: "Alex Rivera", img: "https://i.pravatar.cc/150?img=1" },
            { name: "Sara Khan", img: "https://i.pravatar.cc/150?img=2" },
            { name: "John Lee", img: "https://i.pravatar.cc/150?img=3" }
          ].map((c, i) => (
            <motion.div key={i} whileHover={{ scale: 1.08 }}
              className="p-5 rounded-xl backdrop-blur-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>

              <div className="flex items-center gap-3 mb-3">
                <img src={c.img} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs opacity-60">Full Stack Dev</p>
                </div>
              </div>

              <div className="flex gap-2 text-xs mb-2">
                <span className="px-2 py-1 bg-indigo-500/30 rounded">React</span>
                <span className="px-2 py-1 bg-purple-500/30 rounded">Node</span>
              </div>

              <p className="text-xs opacity-70">"Perfect match for fintech APIs"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
