"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type Invitado = {
  id: string;
  nombre: string;
  codigo_unico: string;
  asistira: boolean | null;
};

type ConfirmState = { kind: "si" | "no"; success: boolean } | null;

type SeaAnimal = {
  src: string;
  width: number;
  delay: number;
  duration: number;
  top: string;
  zIndex: number;
  direction: "left" | "right";
};

const SEA_ANIMALS: SeaAnimal[] = [
  { src: "/pez.png", width: 70, delay: 0, duration: 35, top: "10%", zIndex: 0, direction: "right" },
  { src: "/fish.png", width: 90, delay: 5, duration: 45, top: "30%", zIndex: 20, direction: "left" },
  { src: "/gold-fish.png", width: 65, delay: 2, duration: 50, top: "55%", zIndex: 0, direction: "right" },
  { src: "/anglerfish.png", width: 110, delay: 10, duration: 30, top: "85%", zIndex: 20, direction: "left" },
  { src: "/fishes.png", width: 80, delay: 15, duration: 40, top: "20%", zIndex: 0, direction: "left" },
  { src: "/clown-fish.png", width: 65, delay: 8, duration: 38, top: "70%", zIndex: 0, direction: "right" },
];

function loadEventConfig() {
  return {
    title: process.env.NEXT_PUBLIC_EVENT_TITLE,
    date: process.env.NEXT_PUBLIC_EVENT_DATE,
    time: process.env.NEXT_PUBLIC_EVENT_TIME,
    place: process.env.NEXT_PUBLIC_EVENT_PLACE,
    mapQuery: process.env.NEXT_PUBLIC_EVENT_MAP_QUERY,
  };
}

function OceanBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#8ED6F4] via-[#57B6E5] to-[#1F4E79] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.3),transparent_55%)] -z-10" />

      {Array.from({ length: 20 }).map((_, i) => {
        const left = 5 + (i * 4.5) % 90;
        const size = 8 + (i * 7) % 28;
        const delay = (i % 7) * 0.8;
        const duration = 6 + (i % 5) * 1.5;

        return (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/40 border border-white/50 -z-10"
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

      {SEA_ANIMALS.map((animal, i) => (
        <Image
          key={`animal-${i}`}
          src={animal.src}
          alt="Animal marino"
          width={animal.width}
          height={animal.width}
          className={`absolute pointer-events-none opacity-80 animate-swim-${animal.direction}`}
          style={{
            top: animal.top,
            zIndex: animal.zIndex,
            animationDuration: `${animal.duration}s`,
            animationDelay: `${animal.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function InvitacionPage() {
  const params = useParams();
  const codigo = (params?.codigo as string) || "";

  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [isVisible, setIsVisible] = useState(false);

  const event = useMemo(() => loadEventConfig(), []);

  useEffect(() => {
    if (!codigo) {
      setError("Código de invitación no encontrado en la URL.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchInvitado = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/invitado?codigo=${encodeURIComponent(codigo)}`);
        const data = await response.json();

        if (!cancelled) {
          if (response.ok && data.ok) {
            setInvitado(data.invitado);
          } else {
            setError(data.message || "No se pudo cargar la información del invitado.");
          }
        }
      } catch {
        if (!cancelled) setError("Error de conexión al cargar los datos.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsVisible(true);
        }
      }
    };

    fetchInvitado();
    return () => {
      cancelled = true;
    };
  }, [codigo]);

  const handleConfirm = async (respuesta: "si" | "no") => {
    if (!invitado) return;

    const formData = new FormData();
    formData.append("codigo_unico", invitado.codigo_unico);
    formData.append("respuesta", respuesta);

    try {
      const response = await fetch("/api/confirmar", { method: "POST", body: formData });
      const data = await response.json();

      if (response.ok && data.ok) {
        setInvitado((prev) => (prev ? { ...prev, asistira: respuesta === "si" } : prev));
        setConfirmState({ kind: respuesta, success: true });
      } else {
        setConfirmState({ kind: respuesta, success: false });
      }
    } catch {
      setConfirmState({ kind: respuesta, success: false });
    }
  };

  const mapSrc = useMemo(() => {
    const query = event.mapQuery || "";
    if (!query) return "";
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }, [event.mapQuery]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8ED6F4] to-[#1F4E79]">
        <OceanBackground />
        <div className="relative p-6 text-center text-white z-20">
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
        <div className="relative max-w-sm rounded-3xl bg-white/95 p-8 text-center shadow-2xl z-20">
          <div className="mb-4 text-5xl">⚠️</div>
          <div className="mb-3 text-2xl font-bold text-red-600">Error</div>
          <div className="text-base leading-relaxed text-[#1F4E79]">
            {error || "El código de invitación no es válido o no se pudo cargar la información."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#8ED6F4] to-[#1F4E79]">
      <OceanBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
        <div className={`mb-6 text-center transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
          <div className="mx-auto w-fit rounded-full bg-white/90 px-8 py-4 text-xl md:text-2xl font-bold text-[#1F4E79] shadow-lg backdrop-blur-sm border-2 border-white/60">
            🌊 {event.title} 🌊
          </div>
        </div>

        <div className={`relative rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl overflow-hidden transition-all duration-1000 delay-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A]" />

          <div className="p-6">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A] opacity-75 blur-xl animate-pulse" />
                <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-[#8ED6F4] to-[#57B6E5]">
                  <Image src="/luan.jpeg" alt="Luan" fill className="object-cover" priority sizes="144px" />
                </div>
              </div>
            </div>

            <div className="mb-6 text-center">
              <div className="mb-1 text-base font-semibold text-[#1F4E79]">¡Hola,</div>
              <div className="mb-2 text-3xl font-bold text-[#1F4E79] tracking-tight">{invitado.nombre}!</div>
              <div className="text-sm text-[#57B6E5] font-medium">🐳 Nuestro pequeño explorador del mar cumple 1 año 🐳</div>
            </div>

            <div className="mb-5 space-y-3 rounded-2xl bg-gradient-to-br from-[#8ED6F4]/20 to-[#57B6E5]/20 p-5 border border-[#57B6E5]/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F9D97F] to-[#f7c35b] text-2xl shadow-lg">📅</div>
                <div>
                  <div className="text-xs font-semibold text-[#1F4E79]/70 uppercase tracking-wide">Fecha y Hora</div>
                  <div className="text-base font-bold text-[#1F4E79]">{event.date} · {event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8F7A] to-[#ff6a8c] text-2xl shadow-lg">📍</div>
                <div>
                  <div className="text-xs font-semibold text-[#1F4E79]/70 uppercase tracking-wide">Lugar</div>
                  <div className="text-base font-bold text-[#1F4E79]">{event.place}</div>
                </div>
              </div>
            </div>

            <div className="mb-5 overflow-hidden rounded-2xl border-2 border-[#57B6E5]/40 shadow-xl">
              <div className="bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-4 py-2.5 text-center">
                <div className="text-sm font-bold text-white">🗺️ ¿Cómo llegar?</div>
              </div>
              <div className="aspect-[16/9] w-full">
                <iframe className="h-full w-full border-0" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            <div className="mb-4 text-center">
              <div className="mb-3 text-base font-bold text-[#1F4E79]">¿Nos acompañas a esta aventura bajo el mar? 🌊</div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleConfirm("si")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#7BDCB5] to-[#46b98d] py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-60"
                disabled={invitado.asistira === true}
              >
                ✅ {invitado.asistira === true ? "Confirmado" : "Sí asistiré"}
              </button>
              <button
                onClick={() => handleConfirm("no")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FF8F7A] to-[#ff6a8c] py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-60"
                disabled={invitado.asistira === false}
              >
                ❌ {invitado.asistira === false ? "No confirmado" : "No podré"}
              </button>
            </div>

            {invitado.asistira !== null && (
              <div className="rounded-xl bg-gradient-to-r from-[#8ED6F4]/30 to-[#57B6E5]/30 p-4 text-center border border-[#57B6E5]/40">
                <div className="mb-1 text-sm font-bold text-[#1F4E79]">Estado guardado:</div>
                <div className="text-base font-semibold text-[#1F4E79]">
                  {invitado.asistira ? "¡Confirmado! Nos vemos allá 🎉" : "Te extrañaremos 💙"}
                </div>
              </div>
            )}
          </div>

          <div className="h-2 bg-gradient-to-r from-[#FF8F7A] via-[#7BDCB5] to-[#57B6E5]" />
        </div>

        <div className={`mt-6 text-center transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 inline-block shadow-lg">
            <div className="text-sm font-semibold text-[#1F4E79]">Gracias por visitar la invitación de Luan 💙</div>
            <div className="text-xs text-[#57B6E5] mt-1">¡Te esperamos bajo el mar! 🐠</div>
          </div>
        </div>
      </div>

      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm">
            <div className="relative rounded-3xl bg-white p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A] rounded-t-3xl" />
              <div className="mb-4 text-5xl">{confirmState.kind === "si" ? "🎉" : "💙"}</div>
              <div className="mb-3 text-2xl font-bold text-[#1F4E79]">
                {confirmState.success
                  ? confirmState.kind === "si"
                    ? "¡Gracias por confirmar!"
                    : "¡Gracias por avisarnos!"
                  : "Hubo un error..."}
              </div>
              <div className="mb-6 text-sm leading-relaxed text-[#57B6E5]">
                {confirmState.success ? (
                  confirmState.kind === "si" ? (
                    <>Nos alegra muchísimo que puedas acompañarnos.<br />¡Será un día especial y celebrarlo contigo lo hará aún mejor! 🐠💙</>
                  ) : (
                    <>Entendemos perfectamente.<br />Te mandamos un abrazo y esperamos compartir juntos en otra ocasión. 🐚✨</>
                  )
                ) : (
                  <>No pudimos guardar tu respuesta en este momento.<br />Por favor, inténtalo de nuevo.</>
                )}
              </div>
              <button
                className="rounded-xl bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                onClick={() => setConfirmState(null)}
              >
                Cerrar
              </button>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF8F7A] via-[#7BDCB5] to-[#57B6E5] rounded-b-3xl" />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
        @keyframes swim-right {
          from { transform: translateX(-220px) rotate(5deg); }
          to { transform: translateX(110vw) rotate(-5deg); }
        }
        @keyframes swim-left {
          from { transform: translateX(110vw) scaleX(-1) rotate(5deg); }
          to { transform: translateX(-220px) scaleX(-1) rotate(-5deg); }
        }
        .animate-swim-right { animation: swim-right linear infinite; }
        .animate-swim-left { animation: swim-left linear infinite; }
      `}</style>
    </div>
  );
}