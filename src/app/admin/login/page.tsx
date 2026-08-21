"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user.role !== "admin") {
        setError("Unauthorized. Admin access only.");
        return;
      }
      login(data.user);
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Secure Management Access</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-xs text-center font-bold uppercase">{error}</p>}
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-sm border border-gray-100 focus:outline-none focus:border-black bg-gray-50 rounded-xl"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-sm border border-gray-100 focus:outline-none focus:border-black bg-gray-50 rounded-xl"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Authenticate <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
