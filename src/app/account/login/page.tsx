"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
      login(data.user);
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center uppercase tracking-tighter">Login</h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Link href="/account/forgot" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
              Forgot your password?
            </Link>
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-5 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">New to Elegance?</p>
          <Link 
            href="/account/register"
            className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
