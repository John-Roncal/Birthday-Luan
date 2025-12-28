"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const mesesData = [
  { mes: "Recién nacido", edad: "0 meses", imagen: "/fotos/mes-0.jpg", descripcion: "¡Bienvenido al mundo, Luan!" },
  { mes: "Primer mes", edad: "1 mes", imagen: "/fotos/mes-1.jpg", descripcion: "Celebrando su primer mes" },
  { mes: "Segundo mes", edad: "2 meses", imagen: "/fotos/mes-2.jpg", descripcion: "Descubriendo el mundo" },
  { mes: "Tercer mes", edad: "3 meses", imagen: "/fotos/mes-3.jpg", descripcion: "Respetando las ventanas del sueño" },
  { mes: "Cuarto mes", edad: "4 meses", imagen: "/fotos/mes-4.jpg", descripcion: "Un pingüinito y su juguete favorito" },
  { mes: "Quinto mes", edad: "5 meses", imagen: "/fotos/mes-5.jpg", descripcion: "Conociendo nuevos lugares" },
  { mes: "Sexto mes", edad: "6 meses", imagen: "/fotos/mes-6.jpg", descripcion: "¡Ya medio año de amor!" },
  { mes: "Séptimo mes", edad: "7 meses", imagen: "/fotos/mes-7.jpg", descripcion: "Pequeño explorador" },
  { mes: "Octavo mes", edad: "8 meses", imagen: "/fotos/mes-8.jpg", descripcion: "Primer Halloween|Conociendo el mar" },
  { mes: "Noveno mes", edad: "9 meses", imagen: "/fotos/mes-9.jpg", descripcion: "Creciendo tan rápido" },
  { mes: "Décimo mes", edad: "10 meses", imagen: "/fotos/mes-10.jpg", descripcion: "Primera Navidad" },
  { mes: "Undécimo mes", edad: "11 meses", imagen: "/fotos/mes-11.jpg", descripcion: "Casi un añito" },
  { mes: "¡1 Año!", edad: "12 meses", imagen: "/fotos/mes-12.jpg", descripcion: "¡Feliz primer cumpleaños!" },
];

export default function CarruselFotos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-play del carrusel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mesesData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % mesesData.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + mesesData.length) % mesesData.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentMes = mesesData[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8ED6F4] via-[#57B6E5] to-[#1F4E79] relative overflow-hidden">
      {/* Fondo animado con burbujas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
          const left = 5 + (i * 4.5) % 90;
          const size = 8 + (i * 7) % 28;
          const delay = (i % 7) * 0.8;
          const duration = 6 + (i % 5) * 1.5;

          return (
            <div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-white/30 border border-white/40"
              style={{
                left: `${left}%`,
                bottom: "-10%",
                width: `${size}px`,
                height: `${size}px`,
                animation: `rise ${duration}s linear ${delay}s infinite`,
                boxShadow: "0 8px 20px rgba(255,255,255,0.15)",
              }}
            />
          );
        })}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
          <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F4E79]">
              El Primer Año de Luan 🎂
            </h1>
          </div>
          <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
            Un viaje de 12 meses lleno de amor y alegría
          </p>
        </div>

        {/* Carrusel */}
        <div className={`w-full max-w-4xl transition-all duration-1000 delay-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-white/60">
            {/* Imagen principal */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-100 to-blue-100">
              <Image
                src={currentMes.imagen}
                alt={`Luan - ${currentMes.mes}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              />
              
              {/* Controles de navegación */}
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                aria-label="Foto anterior"
              >
                <span className="text-2xl md:text-3xl text-sky-700">←</span>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                aria-label="Foto siguiente"
              >
                <span className="text-2xl md:text-3xl text-sky-700">→</span>
              </button>

              {/* Indicador de mes en la esquina */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FF8F7A] to-[#ff6a8c] text-white px-4 py-2 rounded-full shadow-lg">
                <span className="font-bold text-sm md:text-base">{currentMes.edad}</span>
              </div>
            </div>

            {/* Información del mes */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">
                  {currentMes.mes}
                </h2>
                <p className="text-base md:text-lg text-sky-700 italic">
                  {currentMes.descripcion}
                </p>
              </div>

              {/* Indicadores de puntos */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {mesesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all ${
                      index === currentIndex
                        ? "w-10 h-3 bg-gradient-to-r from-[#57B6E5] to-[#7BDCB5] rounded-full"
                        : "w-3 h-3 bg-sky-300 hover:bg-sky-400 rounded-full"
                    }`}
                    aria-label={`Ver mes ${index}`}
                  />
                ))}
              </div>

              {/* Control de auto-play */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-full font-medium transition-colors"
                >
                  <span className="text-xl">{isAutoPlaying ? "⏸️" : "▶️"}</span>
                  <span className="text-sm">
                    {isAutoPlaying ? "Pausar" : "Reproducir"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-2xl">🌊</span>
            <span className="text-sm md:text-base font-semibold text-sky-800">
              Gracias por acompañarnos en esta aventura
            </span>
            <span className="text-2xl">💙</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}