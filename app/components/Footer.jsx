import {
  Target,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Heart,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const email = "jan.kadlec07@seznam.cz";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Kopírování selhalo", err);
    }
  };

  return (
    <footer
      className="bg-military-900 border-t border-olive-700"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-olive-700 p-2 rounded">
                <Target className="w-6 h-6 text-khaki-200" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-military font-bold text-khaki-100 tracking-wide">
                  KVZ TRUTNOV 2
                </h3>
                <p className="text-xs text-khaki-400 font-light">
                  Sportovní střelba
                </p>
              </div>
            </div>
            <p className="text-sm text-khaki-400 leading-relaxed">
              Střelecký klub zaměřený na sportovní střelbu, udržování vojenských
              tradic a rozvoj střeleckých dovedností v Trutnově.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigace v patičce">
            <h4 className="text-sm font-military font-bold text-khaki-200 tracking-wider mb-4 uppercase">
              Navigace
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-sm text-khaki-400 hover:text-olive-400 transition-colors"
                  title="Úvod"
                >
                  Úvod
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-sm text-khaki-400 hover:text-olive-400 transition-colors"
                  title="O klubu"
                >
                  O klubu
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="text-sm text-khaki-400 hover:text-olive-400 transition-colors"
                  title="Akce"
                >
                  Akce
                </a>
              </li>
              <li>
                <a
                  href="#results"
                  className="text-sm text-khaki-400 hover:text-olive-400 transition-colors"
                  title="Výsledky"
                >
                  Výsledky
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-khaki-400 hover:text-olive-400 transition-colors"
                  title="Kontakt"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-military font-bold text-khaki-200 tracking-wider mb-4 uppercase">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail
                  className="w-4 h-4 text-olive-500 mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-khaki-300 font-medium">Email</p>
                  <a
                    href="mailto:info@kvztrutnov2.cz"
                    className="text-khaki-400 hover:text-olive-400 transition-colors text-xs break-all"
                  >
                    info@kvztrutnov2.cz
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-4 h-4 text-olive-500 mt-1 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-khaki-300 font-medium">Sídlo</p>
                  <p className="text-khaki-400 text-xs">
                    Trutnov, Česká republika
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Developer & Social */}
          <div>
            <h4 className="text-sm font-military font-bold text-khaki-200 tracking-wider mb-4 uppercase">
              Tvůrce webu
            </h4>
            <div className="bg-olive-700/20 border border-olive-700/40 rounded p-3 mb-4">
              <p className="text-xs text-khaki-300 font-medium mb-2">
                Web vytvořil
              </p>
              <a
                href="https://github.com/Jan-Kadlec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-olive-400 hover:text-olive-300 transition-colors font-medium text-sm"
                title="Jan Kadlec – GitHub profil"
              >
                <Github className="w-4 h-4" />
                Jan Kadlec
              </a>
              <p className="text-xs text-khaki-400 mt-2">
                Full-stack developer | React + Node.js
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://github.com/Jan-Kadlec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 bg-olive-700/20 hover:bg-olive-700/40 rounded flex items-center justify-center text-olive-400 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:jan.kadlec07@seznam.cz"
                aria-label="Email"
                className="w-8 h-8 bg-olive-700/20 hover:bg-olive-700/40 rounded flex items-center justify-center text-olive-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <p
                onClick={copyToClipboard}
                className="text-xs text-khaki-400 mt-2 cursor-pointer hover:text-khaki-300 transition relative"
                title="Klikni pro zkopírování"
              >
                {email}

                {copied && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded">
                    Zkopírováno 📋
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-olive-700 pt-8 mb-6">
          <div className="  mb-6">
            <div className="text-l text-center text-khaki-400">
              <p className="mb-1">
                © {currentYear}{" "}
                <span className="font-medium text-khaki-100">
                  KVZ Trutnov 2
                </span>
              </p>
              <p>
                Web vytvořil{" "}
                <a
                  href="https://github.com/Jan-Kadlec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-olive-400 hover:text-olive-300 font-medium transition-colors inline-flex items-center gap-1"
                >
                  Jan Kadlec
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "KVZ Trutnov 2",
              url: "https://kvztrutnov.cz",
              description:
                "Střelecký klub zaměřený na sportovní střelbu, udržování vojenských tradic a rozvoj střeleckých dovedností.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Trutnov",
                addressCountry: "CZ",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@kvztrutnov2.cz",
                contactType: "Customer Service",
              },
              sameAs: ["https://github.com/Jan-Kadlec"],
            }),
          }}
        />
      </div>
    </footer>
  );
}
