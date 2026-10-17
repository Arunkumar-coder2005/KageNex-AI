"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">KageNex-AI</h1>
      <p>Sign in to access your workspace.</p>

      <button
        onClick={handleLogin}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        Continue with Google
      </button>

      {error && <p role="alert">{error}</p>}
    </main>
  );
}