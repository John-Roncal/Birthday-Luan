"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Invitado = {
  id: string;
  nombre: string;
  codigo_unico: string;
  asistira: boolean | null;
};

type ApiInvitadoResp = { ok: boolean; invitado?: Invitado; message?: string };
type ApiConfirmResp = { ok: boolean; message?: string };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function OceanBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* degradado base + “agua” */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_20%_10%,_rgba(255,255,255,.55),_rgba(255,255,255,0)_60%),
                                   radial-gradient(900px_700px_at_80%_0%,_rgba(255,255,255,.45),_rgba(255,255,255,0)_65%),
                                   linear-gradient(180deg,_#bfefff_0%,_#e9fbff_35%,_#ffffff_100%)]" />

      {/* burbujas */}
      {Array.from({ length: 14 }).map((_, i) => {
        const left = 6 + (i * 7) % 86; // distribución “orgánica”
        const size = 10 + (i * 9) % 34;
        const delay = (i % 5) * 0.6;
        const dur = 7 + (i % 6) * 1.2;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white/70 border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            style={{
              left: `${left}%`,
              bottom: "-12%",
              width: `${size}px`,
              height: `${size}px`,
              filter: "blur(0.2px)",
              animation: `rise ${dur}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      {/* criaturas flotantes (más “personality” sin recargar) */}
      <div className="absolute left-[4%] top-[10%] w-20 animate-float-slow">
        <Octopus />
      </div>
      <div className="absolute right-[6%] top-[18%] w-22 animate-float-slow [animation-delay:0.2s]">
        <Crab />
      </div>
      <div className="absolute left-[12%] bottom-[8%] w-20 animate-float-slow [animation-delay:0.5s]">
        <Turtle />
      </div>
      <div className="absolute right-[10%] bottom-[12%] w-18 animate-float-slow [animation-delay:0.35s]">
        <Starfish />
      </div>
    </div>
  );
}

function Octopus() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-sm">
      <defs>
        <linearGradient id="octo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9db3" />
          <stop offset="1" stopColor="#ff6a8c" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="54" r="36" fill="url(#octo)" />
      <path
        d="M26 92c12 22 32 32 44 32 12 0 32-10 44-32"
        fill="none"
        stroke="url(#octo)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle cx="56" cy="54" r="4" fill="#1f2a3d" />
      <circle cx="84" cy="54" r="4" fill="#1f2a3d" />
      <path d="M60 68c8 8 12 8 20 0" stroke="#1f2a3d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Crab() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-sm">
      <defs>
        <linearGradient id="crab" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb36a" />
          <stop offset="1" stopColor="#ff6f5c" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="70" rx="46" ry="36" fill="url(#crab)" />
      <circle cx="54" cy="64" r="5" fill="#1f2a3d" />
      <circle cx="86" cy="64" r="5" fill="#1f2a3d" />
      <path d="M44 42c10-18 42-18 52 0" fill="none" stroke="url(#crab)" strokeWidth="10" strokeLinecap="round" />
      <path d="M54 90c10 10 22 10 32 0" fill="none" stroke="#1f2a3d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Turtle() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-sm">
      <defs>
        <linearGradient id="turtle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9ee6c6" />
          <stop offset="1" stopColor="#46b98d" />
        </linearGradient>
      </defs>
      <ellipse cx="74" cy="76" rx="46" ry="34" fill="url(#turtle)" />
      <circle cx="46" cy="66" r="16" fill="#bfeedc" />
      <circle cx="46" cy="64" r="4" fill="#1f2a3d" />
      <path d="M22 86c12 12 30 18 50 18" fill="none" stroke="#2c6e5a" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Starfish() {
  return (
    <svg viewBox="0 0 140 140" className="drop-shadow-sm">
      <defs>
        <linearGradient id="star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffeaa1" />
          <stop offset="1" stopColor="#f7c35b" />
        </linearGradient>
      </defs>
      <path
        d="M70 18l18 34 38 8-28 28 6 38-34-18-34 18 6-38-28-28 38-8z"
        fill="url(#star)"
        stroke="#e6b943"
        strokeWidth="3"
      />
      <circle cx="56" cy="72" r="4" fill="#1f2a3d" />
      <circle cx="84" cy="72" r="4" fill="#1f2a3d" />
      <path d="M58 90c12 10 20 10 24 0" fill="none" stroke="#1f2a3d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function InvitacionPage() {
  const params = useParams();
  const codigo = (params?.codigo as string) || "";

  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmState, setConfirmState] = useState<null | { kind: "si" | "no" }>(null);
  const [submitting, setSubmitting] = useState(false);

  const event = useMemo(
    () => ({
      title: process.env.NEXT_PUBLIC_EVENT_TITLE || "Primer cumpleaños de Luan",
      date: process.env.NEXT_PUBLIC_EVENT_DATE || "10 de febrero",
      time: process.env.NEXT_PUBLIC_EVENT_TIME || "16:00 hs",
      place: process.env.NEXT_PUBLIC_EVENT_PLACE || "Salón de fiesta Ensigna",
      mapQuery: process.env.NEXT_PUBLIC_EVENT_MAP_QUERY || "Salón de fiesta Ensigna, Lima, Perú",
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/invitado?codigo=${encodeURIComponent(codigo)}`);
        const json: ApiInvitadoResp = await res.json();

        if (!cancelled) {
          if (!json.ok || !json.invitado) {
            setError(json.message || "No se encontró la invitación.");
          } else {
            setInvitado(json.invitado);
          }
        }
      } catch {
        if (!cancelled) setError("No se pudo cargar la invitación (revisa tu conexión).");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (codigo) load();
    return () => {
      cancelled = true;
    };
  }, [codigo]);

  async function enviar(respuesta: "si" | "no") {
    if (!invitado || submitting) return;
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("codigo_unico", invitado.codigo_unico);
      fd.append("respuesta", respuesta);

      const res = await fetch("/api/confirmar", { method: "POST", body: fd });
      const json: ApiConfirmResp = await res.json();

      if (res.ok && json.ok) {
        setConfirmState({ kind: respuesta });
        // opcional: reflejar en UI sin recargar
        setInvitado((prev) => (prev ? { ...prev, asistira: respuesta === "si" } : prev));
      } else {
        setError(json.message || "No se pudo guardar tu confirmación.");
      }
    } catch {
      setError("Error de red al enviar tu confirmación.");
    } finally {
      setSubmitting(false);
    }
  }

  const mapSrc = useMemo(() => {
    const q = encodeURIComponent(event.mapQuery);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [event.mapQuery]);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <OceanBackground />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
        {/* top badge */}
        <div className="pt-6 px-5">
          <div className="mx-auto w-fit rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur">
            {event.title}
          </div>
        </div>

        {/* card */}
        <div className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur">
          {/* header */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-200 via-white to-pink-200 blur-sm" />
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/80 bg-white">
                <img
                  src="/luan.jpeg"
                  alt="Luan"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-base font-medium text-slate-700">¡Hola,</div>
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                {invitado?.nombre ?? "invitado/a"}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                “Nuestro pequeño explorador del mar” 🐳
              </div>
            </div>
          </div>

          {/* details */}
          <div className="mt-5 rounded-xl border border-white/60 bg-white/70 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-xl">📅</div>
              <div>
                <div className="font-semibold text-slate-900">Fecha y hora</div>
                <div className="text-sm text-slate-700">
                  {event.date} · {event.time}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-3">
              <div className="mt-0.5 text-xl">📍</div>
              <div>
                <div className="font-semibold text-slate-900">Lugar</div>
                <div className="text-sm text-slate-700">{event.place}</div>
              </div>
            </div>
          </div>

          {/* map */}
          <div className="mt-4 overflow-hidden rounded-xl border border-white/60 bg-white/80">
            <div className="px-4 py-3 text-sm font-semibold text-slate-900">
              Mapa (cómo llegar)
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

          {/* actions */}
          <div className="mt-5 flex flex-col gap-3">
            <div className="text-center text-sm text-slate-700">
              ¿Nos acompañas a esta aventura bajo el mar?
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => enviar("si")}
                disabled={submitting}
                className="rounded-xl border border-emerald-200 bg-emerald-500 px-3 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[.98] disabled:opacity-60"
              >
                ✅ Sí asistiré
              </button>
              <button
                onClick={() => enviar("no")}
                disabled={submitting}
                className="rounded-xl border border-rose-200 bg-rose-500 px-3 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[.98] disabled:opacity-60"
              >
                ❌ No podré
              </button>
            </div>
          </div>

          {/* status (after answer) */}
          {invitado && invitado.asistira !== null && (
            <div className="mt-4 rounded-xl border border-white/60 bg-white/70 p-3 text-center">
              <div className="text-sm font-semibold text-slate-900">
                Estado guardado:
              </div>
              <div className="text-sm text-slate-700">
                {invitado.asistira ? "¡Confirmado! ✅" : "Te extrañaremos 😌"}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="pb-10 pt-6 text-center text-xs text-slate-600">
          💙 Con cariño: familia de Luan
        </div>
      </div>

      {/* modal */}
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmState(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/60 bg-white/90 p-5 text-center shadow-[0_22px_80px_rgba(0,0,0,.28)] backdrop-blur">
            <div className="text-2xl font-bold text-slate-900">
              {confirmState.kind === "si" ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!"}
            </div>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">
              {confirmState.kind === "si" ? (
                <>
                  Nos alegra muchísimo que puedas acompañarnos. <br />
                  ¡Será un día especial y celebrarlo contigo lo hará aún mejor! 🐠💙
                </>
              ) : (
                <>
                  Entendemos perfectamente. <br />
                  Te mandamos un abrazo y esperamos compartir juntos en otra ocasión. 🐚✨
                </>
              )}
            </div>
            <button
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm active:scale-[.98]"
              onClick={() => setConfirmState(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* loading / error overlays */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur">
          <div className="rounded-xl border border-white/60 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-800">
            Cargando invitación…
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35">
          <div className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/95 p-5 text-center">
            <div className="text-lg font-bold text-rose-700">Ups…</div>
            <div className="mt-2 text-sm text-slate-700">{error}</div>
            <button
              className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setError(null)}
            >
              Intentar otra vez
            </button>
          </div>
        </div>
      )}
    </div>
  );
}