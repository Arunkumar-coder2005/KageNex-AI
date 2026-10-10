
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function checkBackendHealth() {
  if (!API_URL) {
    throw new Error("Backend API URL is not configured.");
  }

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/health`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Backend returned HTTP ${response.status}`);
  }

  return response.json();
}
