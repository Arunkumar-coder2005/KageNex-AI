"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
      setLoading(false);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Checking your session...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Cognitive Workspace</h1>
        <p className="mt-4 text-slate-300">You are signed in.</p>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Your account</h2>
          <p className="mt-3 break-all text-slate-300">
            Email: {user?.email ?? "No email available"}
          </p>
          <p className="mt-2 break-all text-sm text-slate-500">
            User ID: {user?.id}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
