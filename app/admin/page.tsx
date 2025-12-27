"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      localStorage.setItem("admin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Código incorrecto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h1 className="text-xl font-bold text-center mb-4">
          Acceso de Administrador
        </h1>

        <input
          type="password"
          placeholder="Ingresa el código"
          className="w-full p-2 border rounded-lg mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg mt-4"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}
