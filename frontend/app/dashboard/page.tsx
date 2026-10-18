import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">
        Welcome, {user.email ?? "User"}
      </p>

      <LogoutButton />
    </main>
  );
}