"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const codigo = (params?.codigo as string) || "";

  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const event = useMemo(() => loadEventConfig(), []);

  // Inicializar y reproducir audio automáticamente
  useEffect(() => {
    audioRef.current = new Audio("/music/ocean-theme.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Intentar reproducir automáticamente
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        setIsMusicPlaying(true);
      } catch (error) {
        // Si el navegador bloquea la reproducción automática, mostrar prompt
        console.log("Reproducción automática bloqueada, mostrando prompt");
        setShowMusicPrompt(true);
      }
    };

    // Esperar un momento antes de reproducir
    const timer = setTimeout(playAudio, 500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Función para iniciar la música manualmente
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Error al reproducir audio:", error);
      });
      setIsMusicPlaying(true);
      setShowMusicPrompt(false);
    }
  };

  // Toggle música
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
    }
  };

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
          <div className="text-5xl animate-bounce mb-4">🌊</div>
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold drop-shadow-lg">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error || !invitado) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8ED6F4] to-[#1F4E79] p-4">
        <OceanBackground />
        <div className="relative max-w-sm w-full rounded-3xl bg-white/95 backdrop-blur-lg p-8 text-center shadow-2xl z-20 border-2 border-white/60">
          <div className="mb-6 text-6xl animate-pulse">⚠️</div>
          <div className="mb-4 text-2xl font-bold text-red-600">¡Oops!</div>
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

      {/* Control de música flotante */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white"
        aria-label={isMusicPlaying ? "Pausar música" : "Reproducir música"}
      >
        <span className="text-2xl">{isMusicPlaying ? "🔊" : "🔇"}</span>
      </button>

      {/* Prompt inicial de música */}
      {showMusicPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm">
            <div className="relative rounded-3xl bg-white/95 backdrop-blur-lg p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500 border-2 border-white/60">
              <div className="mb-6 text-6xl animate-bounce">🎵</div>
              <div className="mb-3 text-2xl font-bold text-[#1F4E79]">
                Activa el sonido
              </div>
              <div className="mb-6 text-sm leading-relaxed text-[#57B6E5]">
                Toca aquí para escuchar el sonido de la invitación 🎶
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 text-lg"
                  onClick={startMusic}
                >
                  🔊 Activar sonido bajo el mar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
        <div className={`mb-6 text-center transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
          <div className="mx-auto w-fit rounded-full bg-white/90 px-6 py-3 text-lg md:text-2xl font-bold text-[#1F4E79] shadow-xl backdrop-blur-sm border-2 border-white/60 animate-pulse-slow">
            🌊 {event.title} 🌊
          </div>
        </div>

        <div className={`relative rounded-3xl bg-white/90 backdrop-blur-lg shadow-2xl overflow-hidden transition-all duration-1000 delay-200 border-2 border-white/60 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A]" />

          <div className="p-6">
            {/* Foto de Luan con efecto mejorado */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A] opacity-75 blur-2xl animate-pulse" />
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-[#8ED6F4] to-[#57B6E5] ring-4 ring-white/50">
                  <Image src="/luan.png" alt="Luan" fill className="object-cover" priority sizes="160px" />
                </div>
              </div>
            </div>

            {/* Saludo personalizado mejorado */}
            <div className="mb-6 text-center space-y-2">
              <div className="text-base font-semibold text-[#1F4E79]">¡Hola,</div>
              <div className="text-4xl font-bold text-[#1F4E79] tracking-tight animate-wave-text">
                {invitado.nombre}!
              </div>
              <div className="inline-block bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                🐳 Nuestro pequeño explorador del mar cumple 1 año 🐳
              </div>
            </div>

            {/* Información del evento con iconos mejorados */}
            <div className="mb-5 space-y-3 rounded-2xl bg-gradient-to-br from-[#8ED6F4]/20 to-[#57B6E5]/20 p-5 border-2 border-[#57B6E5]/30 shadow-inner">
              <div className="flex items-center gap-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F9D97F] to-[#f7c35b] text-2xl shadow-lg flex-shrink-0">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#1F4E79]/70 uppercase tracking-wide">Fecha y Hora</div>
                  <div className="text-base font-bold text-[#1F4E79] truncate">{event.date}</div>
                  <div className="text-sm font-semibold text-[#57B6E5]">{event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8F7A] to-[#ff6a8c] text-2xl shadow-lg flex-shrink-0">
                  📍
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#1F4E79]/70 uppercase tracking-wide">Lugar</div>
                  <div className="text-base font-bold text-[#1F4E79]">{event.place}</div>
                </div>
              </div>
            </div>

            {/* Mapa mejorado */}
            <div className="mb-5 overflow-hidden rounded-2xl border-2 border-[#57B6E5]/40 shadow-xl">
              <div className="bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-4 py-3 text-center">
                <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
                  <span className="text-lg">🗺️</span>
                  <span>¿Cómo llegar?</span>
                </div>
              </div>
              <div className="aspect-[16/9] w-full">
                <iframe className="h-full w-full border-0" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            {/* Pregunta de confirmación mejorada */}
            <div className="mb-4 text-center p-4 bg-gradient-to-r from-[#8ED6F4]/20 to-[#57B6E5]/20 rounded-2xl">
              <div className="text-lg font-bold text-[#1F4E79] mb-1">
                ¿Nos acompañas a esta aventura bajo el mar?
              </div>
              <div className="text-3xl">🌊🎉🐠</div>
            </div>

            {/* Botones de confirmación mejorados */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleConfirm("si")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#7BDCB5] to-[#46b98d] py-5 font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                disabled={invitado.asistira === true}
              >
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <span className="text-3xl">✅</span>
                  <span className="text-sm">{invitado.asistira === true ? "Confirmado" : "Sí asistiré"}</span>
                </div>
              </button>
              <button
                onClick={() => handleConfirm("no")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FF8F7A] to-[#ff6a8c] py-5 font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
                disabled={invitado.asistira === false}
              >
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <span className="text-3xl">❌</span>
                  <span className="text-sm">{invitado.asistira === false ? "No confirmado" : "No podré"}</span>
                </div>
              </button>
            </div>

            {/* Estado guardado mejorado */}
            {invitado.asistira !== null && (
              <div className="rounded-2xl bg-gradient-to-r from-[#8ED6F4]/30 to-[#57B6E5]/30 p-5 text-center border-2 border-[#57B6E5]/40 shadow-lg animate-in fade-in duration-500">
                <div className="text-4xl mb-2">{invitado.asistira ? "🎊" : "💙"}</div>
                <div className="mb-1 text-sm font-bold text-[#1F4E79]">Estado guardado:</div>
                <div className="text-lg font-bold text-[#1F4E79]">
                  {invitado.asistira ? "¡Confirmado! Nos vemos allá 🎉" : "Te extrañaremos 💙"}
                </div>
              </div>
            )}
          </div>

          <div className="h-2 bg-gradient-to-r from-[#FF8F7A] via-[#7BDCB5] to-[#57B6E5]" />
        </div>

        {/* Footer mejorado */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="inline-block rounded-2xl bg-white/90 backdrop-blur-sm px-6 py-4 shadow-xl border-2 border-white/60">
            <div className="text-base font-bold text-[#1F4E79] mb-1">
              Gracias por visitar la invitación de Luan 💙
            </div>
            <div className="text-sm text-[#57B6E5] font-medium flex items-center justify-center gap-2">
              <span>🐠</span>
              <span>¡Te esperamos bajo el mar!</span>
              <span>🐚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación mejorado */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm">
            <div className="relative rounded-3xl bg-white/95 backdrop-blur-lg p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500 border-2 border-white/60">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#57B6E5] via-[#7BDCB5] to-[#FF8F7A] rounded-t-3xl" />
              <div className="mb-6 text-7xl animate-bounce">{confirmState.kind === "si" ? "🎉" : "💙"}</div>
              <div className="mb-4 text-3xl font-bold text-[#1F4E79]">
                {confirmState.success
                  ? confirmState.kind === "si"
                    ? "¡Gracias por confirmar!"
                    : "¡Gracias por avisarnos!"
                  : "Hubo un error..."}
              </div>
              <div className="mb-6 text-base leading-relaxed text-[#57B6E5]">
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
                className="w-full rounded-xl bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] px-8 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                onClick={() => {
                  if (confirmState.success) {
                    router.push("/");
                  } else {
                    setConfirmState(null);
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2 text-lg">
                  {confirmState.success ? (
                    <>
                      <span>Ver fotos de Luan</span>
                      <span className="text-2xl">📸</span>
                    </>
                  ) : (
                    "Cerrar"
                  )}
                </span>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.02); }
        }
        .animate-swim-right { animation: swim-right linear infinite; }
        .animate-swim-left { animation: swim-left linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}