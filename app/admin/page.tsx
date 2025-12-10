import { supabase } from "@/lib/supabaseClient";

export default async function AdminPage() {
  const { data: total } = await supabase.from("invitados").select("id", { count: "exact", head: true });
  const { data: si } = await supabase.from("invitados").select("id", { count: "exact", head: true }).eq("asistira", true);
  const { data: no } = await supabase.from("invitados").select("id", { count: "exact", head: true }).eq("asistira", false);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard (Luan)</h1>
      <p>Total invitados: {total?.length ?? 0}</p>
      <p>Asistirán: {si?.length ?? 0}</p>
      <p>No asistirán: {no?.length ?? 0}</p>
    </main>
  );
}