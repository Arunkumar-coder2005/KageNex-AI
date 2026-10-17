"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleLogout}
        className="rounded-lg border px-4 py-2"
      >
        Sign out
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}