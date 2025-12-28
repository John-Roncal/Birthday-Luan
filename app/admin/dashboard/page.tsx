"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Invitado = {
  id: number;
  nombre: string;
  codigo_unico: string;
  asistira: boolean | null;
  telefono?: string;
  mensaje_enviado: boolean;
  fecha_confirmacion?: string;
  mensaje_confirmacion?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviandoMensaje, setEnviandoMensaje] = useState<number | null>(null);

  // Seguridad básica
  useEffect(() => {
    if (localStorage.getItem("admin") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  // Obtener datos
  const fetchData = async () => {
    try {
      const res = await fetch("/api/invitados", { cache: "no-store" });
      const data = await res.json();
      setInvitados(data.data ?? []);
    } catch (error) {
      console.error("Error al cargar invitados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Enviar mensaje de WhatsApp
  const enviarWhatsApp = async (invitado: Invitado) => {
    if (!invitado.telefono) {
      alert("Este invitado no tiene número de teléfono registrado");
      return;
    }

    setEnviandoMensaje(invitado.id);

    try {
      const baseUrl = window.location.origin;
      const urlInvitacion = `${baseUrl}/invitacion/${invitado.codigo_unico}`;
      const mensaje = `Hola ${invitado.nombre}! 🌊\n\nEstás invitado/a al cumpleaños de Luan.\n\nPor favor, confirma tu asistencia aquí: ${urlInvitacion}`;

      // Abrir WhatsApp con el mensaje
      const telefonoLimpio = invitado.telefono.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
      
      window.open(whatsappUrl, "_blank");

      // Actualizar estado en la base de datos
      const response = await fetch("/api/invitados/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invitado.id }),
      });

      if (response.ok) {
        // Actualizar estado local
        setInvitados((prev) =>
          prev.map((inv) =>
            inv.id === invitado.id ? { ...inv, mensaje_enviado: true } : inv
          )
        );
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Hubo un error al intentar enviar el mensaje");
    } finally {
      setEnviandoMensaje(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-xl text-sky-900 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  const total = invitados.length;
  const confirmados = invitados.filter((i) => i.asistira === true).length;
  const rechazados = invitados.filter((i) => i.asistira === false).length;
  const pendientes = invitados.filter((i) => i.asistira === null).length;
  const mensajesEnviados = invitados.filter((i) => i.mensaje_enviado).length;

  // Función para obtener el estado de confirmación
  const getEstadoConfirmacion = (invitado: Invitado) => {
    if (invitado.asistira === true) return "Confirmado";
    if (invitado.asistira === false) return "Rechazado";
    return "Pendiente";
  };

  // Función para obtener el color del badge de estado
  const getColorEstado = (invitado: Invitado) => {
    if (invitado.asistira === true) return "bg-green-600";
    if (invitado.asistira === false) return "bg-red-600";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen p-4 bg-sky-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-sky-900 mb-2">
          Dashboard - Cumpleaños de Luan 🎂
        </h1>
        <p className="text-sky-700">Panel de administración de invitados</p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-5">
        <Card title="Total Invitados" number={total} color="bg-blue-500" icon="👥" />
        <Card title="Confirmados" number={confirmados} color="bg-green-500" icon="✅" />
        <Card title="Rechazados" number={rechazados} color="bg-red-500" icon="❌" />
        <Card title="Pendientes" number={pendientes} color="bg-gray-500" icon="⏳" />
        <Card title="Mensajes Enviados" number={mensajesEnviados} color="bg-purple-500" icon="📱" />
      </div>

      {/* Lista de invitados */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sky-900">Lista de Invitados</h2>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-sky-200">
                <th className="text-left py-3 px-4 font-semibold text-sky-900">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-sky-900">Código</th>
                <th className="text-left py-3 px-4 font-semibold text-sky-900">Teléfono</th>
                <th className="text-center py-3 px-4 font-semibold text-sky-900">Estado Envío</th>
                <th className="text-center py-3 px-4 font-semibold text-sky-900">Confirmación</th>
                <th className="text-left py-3 px-4 font-semibold text-sky-900">Fecha/Mensaje</th>
                <th className="text-center py-3 px-4 font-semibold text-sky-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invitados.map((inv) => (
                <tr key={inv.id} className="border-b border-sky-100 hover:bg-sky-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{inv.nombre}</div>
                  </td>
                  <td className="py-4 px-4">
                    <code className="text-sm bg-sky-100 px-2 py-1 rounded text-sky-800">
                      {inv.codigo_unico}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {inv.telefono || "Sin teléfono"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {inv.mensaje_enviado ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        📨 Enviado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ⏸️ Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getColorEstado(inv)}`}
                    >
                      {getEstadoConfirmacion(inv)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {inv.fecha_confirmacion && (
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">
                          {new Date(inv.fecha_confirmacion).toLocaleDateString("es-ES")}
                        </div>
                        {inv.mensaje_confirmacion && (
                          <div className="text-gray-500 text-xs italic line-clamp-2">
                            "{inv.mensaje_confirmacion}"
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => enviarWhatsApp(inv)}
                      disabled={!inv.telefono || enviandoMensaje === inv.id}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        !inv.telefono
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : inv.mensaje_enviado
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {enviandoMensaje === inv.id ? (
                        "⏳ Enviando..."
                      ) : inv.mensaje_enviado ? (
                        "📱 Reenviar"
                      ) : (
                        "📤 Enviar"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invitados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎈</div>
            <p className="text-xl text-gray-600">No hay invitados registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  number,
  color,
  icon,
}: {
  title: string;
  number: number;
  color: string;
  icon: string;
}) {
  return (
    <div className={`${color} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm opacity-90">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{number}</p>
    </div>
  );
}