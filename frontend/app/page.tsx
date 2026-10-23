"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signIn() {
    setMessage("Signing in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }
    const accessToken = data.session?.access_token;

if (!accessToken) {
  setMessage("No access token found. Please sign in again.");
  return;
}

setMessage("Sign-in successful! Access token obtained.");
try {
  const response = await fetch("http://127.0.0.1:8000/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    setMessage(`API error: ${result.detail}`);
    return;
  }

  setMessage(
    `Authenticated successfully! User ID: ${result.id}, Email: ${result.email}`
  );
} catch {
  setMessage("Could not connect to the backend. Check that FastAPI is running.");
}

    setMessage(
      `Sign-in successful! User: ${data.user.email}`
    );

    console.log("Access token:", data.session.access_token);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">KageNex AI Sign In</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={signIn}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Sign In
      </button>

      <p>{message}</p>
    </main>
  );
}
