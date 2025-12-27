"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Invitado = {
  id: number;
  nombre: string;
  codigo: string;
  asistencia: boolean | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);

  // Seguridad básica
  useEffect(() => {
    if (localStorage.getItem("admin") !== "true") {
      router.push("/admin");
    }
  }, []);

  // Obtener datos
  const fetchData = async () => {
    const res = await fetch("/api/invitados", { cache: "no-store" });
    const data = await res.json();
    setInvitados(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando...</p>;

  const total = invitados.length;
  const si = invitados.filter((i) => i.asistencia === true).length;
  const no = invitados.filter((i) => i.asistencia === false).length;
  const sinRespuesta = invitados.filter((i) => i.asistencia === null).length;

  return (
    <div className="min-h-screen p-4 bg-sky-50">
      <h1 className="text-3xl font-bold mb-4 text-sky-900">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
        <Card title="Invitados" number={total} color="bg-blue-500" />
        <Card title="Asisten" number={si} color="bg-green-500" />
        <Card title="No Asisten" number={no} color="bg-red-500" />
        <Card title="Sin Respuesta" number={sinRespuesta} color="bg-gray-500" />
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold mb-4">Lista de invitados</h2>

        <div className="space-y-3">
          {invitados.map((inv) => (
            <div
              key={inv.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{inv.nombre}</p>
                <p className="text-sm text-gray-500">Código: {inv.codigo}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-lg text-white text-sm ${
                  inv.asistencia === true
                    ? "bg-green-600"
                    : inv.asistencia === false
                    ? "bg-red-600"
                    : "bg-gray-500"
                }`}
              >
                {inv.asistencia === true
                  ? "Asiste"
                  : inv.asistencia === false
                  ? "No Asiste"
                  : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  number,
  color,
}: {
  title: string;
  number: number;
  color: string;
}) {
  return (
    <div className={`${color} text-white rounded-xl p-4 shadow-lg`}>
      <p className="font-semibold">{title}</p>
      <p className="text-2xl font-bold">{number}</p>
    </div>
  );
}