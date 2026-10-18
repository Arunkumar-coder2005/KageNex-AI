"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/account";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-slate-400">
          Sign in to your Cognitive Workspace.
        </p>

        <label className="block">
          <span className="mb-2 block text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none focus:border-cyan-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 outline-none focus:border-cyan-400"
            placeholder="Enter your password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {message && (
          <p role="alert" className="text-sm text-red-400">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
