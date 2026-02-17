import { Target } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="bg-military-900 border-t border-olive-800"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-olive-700 p-2 rounded">
                <Target className="w-6 h-6 text-khaki-200" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-military font-bold text-khaki-100 tracking-wide">
                  KVZ TRUTNOV 2
                </h3>
                <p className="text-xs text-khaki-400 font-light tracking-wider">
                  Klub vojáků v záloze – sportovní střelba a rozvoj střeleckých
                  dovedností
                </p>
              </div>
            </div>
            <p className="text-sm text-khaki-400 leading-relaxed">
              Střelecký klub zaměřený na <strong>sportovní střelbu</strong>,
              udržování <strong>vojenských tradic</strong> a rozvoj střeleckých
              dovedností. Připojte se k nám a buďte součástí aktivní komunity
              střelců v Trutnově a okolí.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Rychlé odkazy">
            <h4 className="text-sm font-military font-bold text-khaki-200 tracking-wider mb-4 uppercase">
              Rychlé odkazy
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-sm text-khaki-400 hover:text-khaki-200 transition-colors"
                  title="O klubu KVZ Trutnov 2"
                >
                  O klubu
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  className="text-sm text-khaki-400 hover:text-khaki-200 transition-colors"
                  title="Nadcházející akce KVZ Trutnov 2"
                >
                  Akce
                </a>
              </li>
              <li>
                <a
                  href="#results"
                  className="text-sm text-khaki-400 hover:text-khaki-200 transition-colors"
                  title="Výsledky střeleckých akcí"
                >
                  Výsledky
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-khaki-400 hover:text-khaki-200 transition-colors"
                  title="Kontakt na KVZ Trutnov 2"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </nav>

          {/* Social / Contact */}
          <address className="not-italic">
            <h4 className="text-sm font-military font-bold text-khaki-200 tracking-wider mb-4 uppercase">
              Sledujte nás
            </h4>
            <p className="text-sm text-khaki-400 leading-relaxed mb-2">
              Sledujte naše <strong>novinky, akce a výsledky</strong> na
              sociálních sítích a webu klubu.
            </p>
            <p className="text-sm text-khaki-400">
              Kontakt:{" "}
              <a
                href="mailto:info@kvztrutnov2.cz"
                className="underline hover:text-olive-400"
              >
                info@kvztrutnov2.cz
              </a>
            </p>
          </address>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-olive-800">
          <p className="text-center text-sm text-khaki-500">
            &copy; {new Date().getFullYear()} <strong>KVZ Trutnov 2</strong>.
            Všechna práva vyhrazena. <br />
            Web vytvořil Jan Kadlec.{" "}
            <a
              href="mailto: jan.kadlec07@seznam.cz"
              id="webmaster"
              className="underline hover:text-olive-400"
            >
              info@kvztrutnov2.cz
            </a>{" "}
            <br />
            Klub vojáků v záloze – sportovní střelba, soutěže a komunitní akce.
          </p>
        </div>
      </div>
    </footer>
  );
}
