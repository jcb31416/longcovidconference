// src/components/Hero.jsx
import Image from 'next/image';

export default function Hero({ children }) {
  return (
    <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
      {/* background GIF */}
      <Image
        src="/herovideo.gif"      // ruta relativa a /public
        alt=""
        fill                         // cubre todo el contenedor
        priority                     // precarga; evita parpadeo
        unoptimized                  // no lo convierte a WebP
        className="object-cover"
      />


      {/* overlay 100 % opaco */}
      <div className="
        absolute inset-0 z-10 pointer-events-none /* ≃16 px de blur */
        backdrop-blur-0
        backdrop-saturate-30
      "/>


      <h1 className="relative z-10 text-4xl md:text-6xl font-extralight italic text-zinc-100 text-center">
        {children}
      </h1>

    </div>
  );
}
