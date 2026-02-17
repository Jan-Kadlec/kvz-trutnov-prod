import { useState } from "react";
import { Target, Menu, X } from "lucide-react";

export default function Header({ onNavigate, currentSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Úvod" },
    { id: "about", label: "O klubu" },
    { id: "news", label: "Aktuality" },
    { id: "ranges", label: "Střelnice" },
    { id: "events", label: "Akce" },
    { id: "results", label: "Výsledky & Foto" },
    { id: "contact", label: "Kontakt" },
  ];

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-military-900/95 backdrop-blur-sm border-b border-olive-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="bg-olive-700 p-2 rounded">
              <Target className="w-8 h-8 text-khaki-200" />
            </div>
            <div>
              <h1 className="text-xl font-military font-bold text-khaki-100 tracking-wide">
                KVZ TRUTNOV 2
              </h1>
              <p className="text-xs text-khaki-400 font-light tracking-wider">
                KLUB VOJÁKŮ V ZÁLOZE
              </p>
            </div>
          </div>

          <nav
            className="hidden md:flex items-center space-x-1"
            aria-label="Hlavní navigace"
          >
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                aria-current={currentSection === item.id ? "page" : undefined}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded ${
                  currentSection === item.id
                    ? "bg-olive-700 text-khaki-100"
                    : "text-khaki-300 hover:bg-military-800 hover:text-khaki-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-khaki-300 hover:bg-military-800 hover:text-khaki-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className="md:hidden pb-4 space-y-1"
            aria-label="Mobilní navigace"
          >
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                aria-current={currentSection === item.id ? "page" : undefined}
                className={`block w-full text-left px-4 py-3 text-base font-medium tracking-wide transition-colors rounded ${
                  currentSection === item.id
                    ? "bg-olive-700 text-khaki-100"
                    : "text-khaki-300 hover:bg-military-800 hover:text-khaki-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
