
"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/lib/api";

export default function ApiStatus() {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    checkBackendHealth()
      .then(() => setStatus("Connected"))
      .catch((err: unknown) => {
        setStatus("Disconnected");
        setError(
          err instanceof Error
            ? err.message
            : "Backend unavailable"
        );
      });
  }, []);

  return (
    <section>
      <h2>Backend Connection</h2>
      <p>Status: {status}</p>
      {error && <p role="alert">Error: {error}</p>}
    </section>
  );
}
