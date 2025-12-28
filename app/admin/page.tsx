"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsLoading(true);
      setError("");
      localStorage.setItem("admin", "true");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    } else {
      setError("Código incorrecto");
      // Limpiar error después de 3 segundos
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8ED6F4] via-[#57B6E5] to-[#1F4E79] relative overflow-hidden">
      {/* Decoración de burbujas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => {
          const left = 5 + (i * 6.5) % 90;
          const size = 10 + (i * 5) % 30;
          const delay = (i % 8) * 0.8;
          const duration = 8 + (i % 6) * 1.5;

          return (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-white/20 border border-white/30"
              style={{
                left: `${left}%`,
                bottom: "-10%",
                width: `${size}px`,
                height: `${size}px`,
                animation: `rise ${duration}s linear ${delay}s infinite`,
                boxShadow: "0 8px 20px rgba(255,255,255,0.1)",
              }}
            />
          );
        })}
      </div>

      {/* Card de login */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-white/60">
          {/* Header con icono */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#57B6E5] to-[#7BDCB5] mb-4 shadow-lg">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-sky-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-sm text-sky-600">
              Cumpleaños de Luan 🎂
            </p>
          </div>

          {/* Input de contraseña */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-sky-900 mb-2">
              Código de acceso
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Ingresa el código secreto"
                className="w-full p-4 pr-12 border-2 border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all text-gray-900 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                🔑
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Botón de login */}
          <button
            onClick={handleLogin}
            disabled={!password || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              !password || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Ingresando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Ingresar al Panel
                <span className="text-xl">🚀</span>
              </span>
            )}
          </button>

          {/* Información adicional */}
          <div className="mt-6 text-center">
            <p className="text-xs text-sky-600">
              Acceso exclusivo para administradores
            </p>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-2xl">🌊</span>
            <span className="text-sm font-medium text-sky-800">Mundo Marino</span>
            <span className="text-2xl">🐠</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}