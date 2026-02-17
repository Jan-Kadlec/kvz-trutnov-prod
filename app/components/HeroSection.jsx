import { ArrowRight, Shield } from "lucide-react";

export default function HeroSection({ onNavigate }) {
  return (
    <section
      id="home"
      aria-label="Úvodní sekce - KVZ Trutnov 2"
      className="relative min-h-screen flex items-center bg-military-900"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-military-900 via-olive-900 to-military-800 opacity-90"></div>

      {/* Background image (also provide hidden img for SEO/alt text) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/hero-background.jpg')",
        }}
        role="img"
        aria-hidden="true"
      ></div>
      <img
        src="/hero-background.jpg"
        alt="KVZ Trutnov 2 - ilustrační pozadí: střelecký klub a akce"
        className="sr-only"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-12 h-12 text-olive-500" />
            <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
              Od roku 1991
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-military font-bold text-khaki-100 mb-6 tracking-tight leading-tight">
            KVZ TRUTNOV 2
          </h1>

          <p className="text-xl sm:text-2xl text-khaki-300 mb-4 font-light tracking-wide">
            Klub vojáků v záloze
          </p>

          <p className="text-lg text-khaki-400 mb-8 leading-relaxed max-w-2xl">
            Jsme střelecký klub zaměřený na rozvoj střeleckých dovedností,
            sportovní střelbu a udržování vojenských tradic. Pořádáme pravidelné
            akce a soustředění pro všechny příznivce střelby.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate("events")}
              aria-label="Přejít na sekci Nadcházející akce"
              className="inline-flex items-center justify-center px-8 py-4 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors group"
            >
              <span>Zobrazit nadcházející akce</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("about")}
              aria-label="Přejít na sekci O klubu"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-olive-700 hover:bg-olive-700/20 text-khaki-100 font-medium rounded transition-colors"
            >
              O klubu
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl">
            <div>
              <div className="text-3xl font-military font-bold text-olive-400 mb-1">
                30+
              </div>
              <div className="text-sm text-khaki-500 uppercase tracking-wide">
                Let tradice
              </div>
            </div>
            <div>
              <div className="text-3xl font-military font-bold text-olive-400 mb-1">
                4x
              </div>
              <div className="text-sm text-khaki-500 uppercase tracking-wide">
                Akce ročně
              </div>
            </div>
            <div>
              <div className="text-3xl font-military font-bold text-olive-400 mb-1">
                50+
              </div>
              <div className="text-sm text-khaki-500 uppercase tracking-wide">
                Členů
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-olive-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-olive-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
