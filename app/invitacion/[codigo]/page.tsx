"use client"; // <-- FIX: Directiva de cliente añadida

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation"; // <-- Nuevo: Para obtener el código de la URL

type Invitado = {
  id: string;
  nombre: string;
  codigo_unico: string;
  asistira: boolean | null;
};

// Función para cargar la configuración del evento desde variables de entorno
const loadEventConfig = () => {
  // Se asume que has prefijado tus variables con NEXT_PUBLIC_ para que el cliente pueda acceder.
  return {
    title: process.env.NEXT_PUBLIC_EVENT_TITLE,
    date: process.env.NEXT_PUBLIC_EVENT_DATE,
    time: process.env.NEXT_PUBLIC_EVENT_TIME,
    place: process.env.NEXT_PUBLIC_EVENT_PLACE,
    mapQuery: process.env.NEXT_PUBLIC_EVENT_MAP_QUERY,
  };
};

// (OceanBackground, Octopus, Crab, Turtle, Starfish, Fish components remain the same)
function OceanBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Degradado oceánico de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8ED6F4] via-[#57B6E5] to-[#1F4E79]" />
      
      {/* Overlay de luz suave */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.3),transparent_50%)]" />

      {/* Burbujas animadas */}
      {Array.from({ length: 20 }).map((_, i) => {
        const left = 5 + (i * 4.5) % 90;
        const size = 8 + (i * 7) % 28;
        const delay = (i % 7) * 0.8;
        const duration = 6 + (i % 5) * 1.5;
        
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 border border-white/50"
            style={{
              left: `${left}%`,
              bottom: "-10%",
              width: `${size}px`,
              height: `${size}px`,
              animation: `rise ${duration}s linear ${delay}s infinite`,
              boxShadow: "0 8px 20px rgba(255,255,255,0.2)",
            }}
          />
        );
      })}

      {/* Criaturas marinas flotantes */}
      <div className="absolute left-[8%] top-[12%] w-16 animate-float-slow opacity-80">
        <Octopus />
      </div>
      <div className="absolute right-[10%] top-[20%] w-20 animate-float-slow opacity-75" style={{ animationDelay: "0.3s" }}>
        <Crab />
      </div>
      <div className="absolute left-[15%] bottom-[15%] w-20 animate-float-slow opacity-70" style={{ animationDelay: "0.7s" }}>
        <Turtle />
      </div>
      <div className="absolute right-[12%] bottom-[25%] w-16 animate-float-slow opacity-80" style={{ animationDelay: "0.5s" }}>
        <Starfish />
      </div>
      <div className="absolute left-[70%] top-[35%] w-14 animate-float-slow opacity-60" style={{ animationDelay: "1s" }}>
        <Fish />
      </div>
    </div>
  );
}

function Octopus() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-lg">
      <defs>
        <linearGradient id="octo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8F7A" />
          <stop offset="1" stopColor="#ff6a8c" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="54" r="38" fill="url(#octo)" opacity="0.9" />
      <path
        d="M24 92c12 24 34 34 46 34 12 0 34-10 46-34"
        fill="none"
        stroke="url(#octo)"
        strokeWidth="18"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="56" cy="54" r="5" fill="#1f2a3d" />
      <circle cx="84" cy="54" r="5" fill="#1f2a3d" />
      <path d="M60 68c8 8 12 8 20 0" stroke="#1f2a3d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Crab() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-lg">
      <defs>
        <linearGradient id="crab" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8F7A" />
          <stop offset="1" stopColor="#ff6f5c" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="70" rx="48" ry="38" fill="url(#crab)" opacity="0.9" />
      <circle cx="54" cy="64" r="6" fill="#1f2a3d" />
      <circle cx="86" cy="64" r="6" fill="#1f2a3d" />
      <path d="M42 40c12-20 44-20 56 0" fill="none" stroke="url(#crab)" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
      <path d="M54 90c10 10 22 10 32 0" fill="none" stroke="#1f2a3d" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Turtle() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-lg">
      <defs>
        <linearGradient id="turtle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7BDCB5" />
          <stop offset="1" stopColor="#46b98d" />
        </linearGradient>
      </defs>
      <ellipse cx="74" cy="76" rx="48" ry="36" fill="url(#turtle)" opacity="0.9" />
      <circle cx="46" cy="66" r="18" fill="#bfeedc" opacity="0.8" />
      <circle cx="46" cy="64" r="5" fill="#1f2a3d" />
      <path d="M20 86c14 14 32 20 54 20" fill="none" stroke="#2c6e5a" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Starfish() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-lg">
      <defs>
        <linearGradient id="star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F9D97F" />
          <stop offset="1" stopColor="#f7c35b" />
        </linearGradient>
      </defs>
      <path
        d="M70 16l20 36 40 10-30 30 8 40-38-20-38 20 8-40-30-30 40-10z"
        fill="url(#star)"
        stroke="#e6b943"
        strokeWidth="4"
        opacity="0.9"
      />
      <circle cx="56" cy="72" r="5" fill="#1f2a3d" />
      <circle cx="84" cy="72" r="5" fill="#1f2a3d" />
      <path d="M58 92c14 12 22 12 26 0" fill="none" stroke="#1f2a3d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Fish() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-lg">
      <defs>
        <linearGradient id="fish" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#57B6E5" />
          <stop offset="1" stopColor="#3da3d5" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="70" rx="35" ry="25" fill="url(#fish)" opacity="0.9" />
      <circle cx="50" cy="65" r="4" fill="#1f2a3d" />
      <path d="M95 70L120 55 L120 85Z" fill="url(#fish)" opacity="0.9" />
    </svg>
  );
}
// ----------------------------------------------------------------------
// Componente principal modificado
// ----------------------------------------------------------------------

export default function InvitacionPage() {
  const params = useParams();
  const codigo = params.codigo as string; // Obtener el código de la URL
  
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<null | { kind: "si" | "no"; success: boolean }>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Cargar detalles del evento desde variables de entorno
  const event = useMemo(() => loadEventConfig(), []);

  // 1. Lógica de carga del Invitado
  useEffect(() => {
    if (!codigo) {
      setError("Código de invitación no encontrado en la URL.");
      setIsLoading(false);
      return;
    }

    const fetchInvitado = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/invitado?codigo=${codigo}`);
        const data = await response.json();

        if (response.ok && data.ok) {
          setInvitado(data.invitado);
        } else {
          setError(data.message || "No se pudo cargar la información del invitado.");
        }
      } catch (e) {
        console.error("Error fetching invitado:", e);
        setError("Error de conexión al cargar los datos.");
      } finally {
        setIsLoading(false);
        setIsVisible(true); // Iniciar animación una vez que se complete la carga
      }
    };

    fetchInvitado();
  }, [codigo]);

  // 2. Lógica de Confirmación
  const handleConfirm = async (respuesta: "si" | "no") => {
    if (!invitado) return; 

    const formData = new FormData();
    formData.append("codigo_unico", invitado.codigo_unico);
    formData.append("respuesta", respuesta);

    try {
      const response = await fetch("/api/confirmar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        // Actualizar el estado local en caso de éxito
        setInvitado((prev) => (prev ? { ...prev, asistira: respuesta === "si" } : null));
        setConfirmState({ kind: respuesta, success: true });
      } else {
        setConfirmState({ kind: respuesta, success: false });
        console.error("Error al confirmar:", data.message);
      }
    } catch (e) {
      setConfirmState({ kind: respuesta, success: false });
      console.error("Error de red al confirmar:", e);
    }
  };

  const mapSrc = useMemo(() => {
    const q = encodeURIComponent(event.mapQuery);
    // URL de Google Maps corregida para el formato embed
    return `https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`; 
  }, [event.mapQuery]);

  // --- RENDERING ESTADOS ---

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8ED6F4] to-[#1F4E79]">
        <OceanBackground />
        <div className="relative p-6 text-center text-white">
          <div className="text-4xl animate-bounce">🌊</div>
          <p className="mt-4 text-lg font-semibold">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error || !invitado) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8ED6F4] to-[#1F4E79]">
        <OceanBackground />
        <div className="relative max-w-sm rounded-3xl bg-white/95 p-8 text-center shadow-2xl">
          <div className="mb-4 text-5xl">⚠️</div>
          <div className="mb-3 text-2xl font-bold text-red-600">
            Error
          </div>
          <div className="text-base leading-relaxed text-[#1F4E79]">
            {error || "El código de invitación no es válido o no se pudo cargar la información."}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING INVITACIÓN ---

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#8ED6F4] to-[#1F4E79]">
      <OceanBackground />

      {/* Contenido principal */}
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
        
        {/* Badge superior con animación */}
        <div 
          className={`mb-6 text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          <div className="mx-auto w-fit rounded-full bg-white/90 px-6 py-2.5 text-sm font-bold text-[#1F4E79] shadow-lg backdrop-blur-sm border-2 border-white/60">
            🌊 {event.title} 🌊 {/* Usa data del .env */}
          </div>
        </div>

        {/* Tarjeta principal */}
        <div 
          className={`relative rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-1000 delay-200 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Decoración superior */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A]" />
          
          <div className="p-6">
            {/* Foto de Luan con efecto destacado */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                {/* Anillo animado de brillo */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A] opacity-75 blur-xl animate-pulse" />
                
                {/* Contenedor de imagen */}
                <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-[#8ED6F4] to-[#57B6E5]">
                  <img
                    src="/luan.jpeg"
                    alt="Luan"
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Decoración de burbujas alrededor */}
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white/70 border-2 border-white/90 animate-bounce" style={{ animationDelay: "0s", animationDuration: "2s" }} />
                <div className="absolute top-8 -left-3 h-4 w-4 rounded-full bg-white/60 border-2 border-white/80 animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "2.5s" }} />
                <div className="absolute -bottom-1 right-6 h-5 w-5 rounded-full bg-white/65 border-2 border-white/85 animate-bounce" style={{ animationDelay: "0.6s", animationDuration: "2.2s" }} />
              </div>
            </div>

            {/* Saludo personalizado */}
            <div className="mb-6 text-center">
              <div className="mb-1 text-base font-semibold text-[#1F4E79]">¡Hola,</div>
              <div className="mb-2 text-3xl font-bold text-[#1F4E79] tracking-tight">
                {invitado.nombre}! {/* Usa data del invitado */}
              </div>
              <div className="text-sm text-[#57B6E5] font-medium">
                🐳 Nuestro pequeño explorador del mar cumple 1 año 🐳
              </div>
            </div>

            {/* Detalles del evento con iconos */}
            <div className="mb-5 space-y-3 rounded-2xl bg-gradient-to-br from-[#8ED6F4]/20 to-[#57B6E5]/20 p-5 border border-[#57B6E5]/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F9D97F] to-[#f7c35b] text-2xl shadow-lg">
                  📅
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1F4E79]/70 uppercase tracking-wide">Fecha y Hora</div>
                  <div className="text-base font-bold text-[#1F4E79]">
                    {event.date} · {event.time} {/* Usa data del .env */}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8F7A] to-[#ff6a8c] text-2xl shadow-lg">
                  📍
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#1F4E79]/70 uppercase tracking-wide">Lugar</div>
                  <div className="text-base font-bold text-[#1F4E79]">{event.place}</div> {/* Usa data del .env */}
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="mb-5 overflow-hidden rounded-2xl border-2 border-[#57B6E5]/40 shadow-xl">
              <div className="bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-4 py-2.5 text-center">
                <div className="text-sm font-bold text-white">🗺️ ¿Cómo llegar?</div>
              </div>
              <div className="aspect-[16/9] w-full">
                <iframe
                  className="h-full w-full border-0"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Pregunta de confirmación */}
            <div className="mb-4 text-center">
              <div className="mb-3 text-base font-bold text-[#1F4E79]">
                ¿Nos acompañas a esta aventura bajo el mar? 🌊
              </div>
            </div>

            {/* Botones de confirmación */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleConfirm("si")}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#7BDCB5] to-[#46b98d] py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 
                  ${invitado.asistira === true ? 'ring-4 ring-[#7BDCB5]/50' : ''}
                `}
                disabled={invitado.asistira === true}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {invitado.asistira === true ? '✅ Confirmado' : '✅ Sí asistiré'}
                </span>
              </button>
              <button
                onClick={() => handleConfirm("no")}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FF8F7A] to-[#ff6a8c] py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95
                  ${invitado.asistira === false ? 'ring-4 ring-[#FF8F7A]/50' : ''}
                `}
                disabled={invitado.asistira === false}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {invitado.asistira === false ? '❌ No confirmado' : '❌ No podré'}
                </span>
              </button>
            </div>

            {/* Estado de confirmación */}
            {invitado.asistira !== null && (
              <div className="rounded-xl bg-gradient-to-r from-[#8ED6F4]/30 to-[#57B6E5]/30 p-4 text-center border border-[#57B6E5]/40">
                <div className="mb-1 text-sm font-bold text-[#1F4E79]">
                  Estado guardado:
                </div>
                <div className="text-base font-semibold text-[#1F4E79]">
                  {invitado.asistira ? "¡Confirmado! Nos vemos allá 🎉" : "Te extrañaremos 💙"}
                </div>
              </div>
            )}
          </div>

          {/* Decoración inferior */}
          <div className="h-2 bg-gradient-to-r from-[#FF8F7A] via-[#7BDCB5] to-[#57B6E5]" />
        </div>

        {/* Footer con mensaje */}
        <div 
          className={`mt-6 text-center transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 inline-block shadow-lg">
            <div className="text-sm font-semibold text-[#1F4E79]">
              Gracias por visitar la invitación de Luan 💙
            </div>
            <div className="text-xs text-[#57B6E5] mt-1">
              ¡Te esperamos bajo el mar! 🐠
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm">
            {/* Burbujas decorativas en el modal */}
            <div className="absolute -top-4 left-1/4 h-8 w-8 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="absolute -top-6 right-1/3 h-6 w-6 rounded-full bg-white/25 animate-bounce" style={{ animationDelay: "0.2s" }} />
            
            <div className="relative rounded-3xl bg-white p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500">
              {/* Decoración superior del modal */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A] rounded-t-3xl" />
              
              <div className="mb-4 text-5xl">
                {confirmState.kind === "si" ? "🎉" : "💙"}
              </div>
              <div className="mb-3 text-2xl font-bold text-[#1F4E79]">
                {confirmState.success 
                  ? (confirmState.kind === "si" ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!")
                  : "Hubo un error..."}
              </div>
              <div className="mb-6 text-sm leading-relaxed text-[#57B6E5]">
                {confirmState.success ? (
                  confirmState.kind === "si" ? (
                    <>
                      Nos alegra muchísimo que puedas acompañarnos. <br />
                      ¡Será un día especial y celebrarlo contigo lo hará aún mejor! 🐠💙
                    </>
                  ) : (
                    <>
                      Entendemos perfectamente. <br />
                      Te mandamos un abrazo y esperamos compartir juntos en otra ocasión. 🐚✨
                    </>
                  )
                ) : (
                  <>
                    No pudimos guardar tu respuesta en este momento. <br />
                    Por favor, inténtalo de nuevo.
                  </>
                )}
              </div>
              <button
                className="rounded-xl bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                onClick={() => setConfirmState(null)}
              >
                Cerrar
              </button>
              
              {/* Decoración inferior del modal */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF8F7A] via-[#7BDCB5] to-[#57B6E5] rounded-b-3xl" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120vh) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}