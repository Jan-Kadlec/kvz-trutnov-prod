import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "v.bocarov@seznam.cz",
      link: "mailto:v.bocarov@seznam.cz",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: "+420 601 571 622",
      link: "tel:+420601571622",
    },
    {
      icon: MapPin,
      label: "Adresa",
      value: "Trutnov, Královéhradecký kraj",
      link: null,
    },
  ];

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-military-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Spojte se s námi
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-military font-bold text-khaki-100 mt-4 mb-6">
            Kontakt
          </h2>

          <div className="w-24 h-1 bg-olive-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Levá část */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-2xl font-military font-bold text-khaki-100 mb-6">
              Kontaktní údaje
            </h3>

            <p className="text-khaki-400 leading-relaxed mb-8">
              Máte zájem o členství v našem klubu nebo se chcete zúčastnit
              některé z našich akcí? Neváhejte nás kontaktovat. Rádi vám
              poskytneme více informací.
            </p>

            <div className="space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;

                const content = (
                  <div className="flex items-start gap-4 p-3 sm:p-4 bg-military-800 border border-olive-800 rounded-lg hover:border-olive-600 transition-colors">
                    <div className="bg-olive-700/20 p-2.5 sm:p-3 rounded-lg shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-olive-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-khaki-500 uppercase tracking-wider mb-1">
                        {item.label}
                      </div>

                      <div className="text-khaki-100 font-medium break-words">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );

                return item.link ? (
                  <a
                    key={index}
                    href={item.link}
                    className="block w-full min-w-0"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={index} className="min-w-0">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-5 sm:p-6 bg-olive-900/20 border border-olive-800 rounded-lg">
              <h4 className="text-lg font-military font-bold text-khaki-100 mb-3">
                Chcete se stát členem?
              </h4>

              <p className="text-khaki-400 text-sm leading-relaxed">
                Pokud máte zájem o členství v našem klubu, kontaktujte nás
                pomocí výše uvedených kontaktů. Rádi vám poskytneme všechny
                potřebné informace o členství a našich aktivitách.
              </p>
            </div>
          </div>

          {/* Pravá část */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-2xl font-military font-bold text-khaki-100 mb-6">
              Kde nás najdete
            </h3>

            <div className="bg-military-800 border border-olive-800 rounded-lg overflow-hidden h-72 sm:h-80 md:h-96 lg:h-[500px] w-full">
              <iframe
                src="https://www.google.com/maps?q=Trutnov,+Czech+Republic&output=embed"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa - Trutnov"
              />
            </div>

            <div className="mt-6 p-4 bg-military-800 border border-olive-800 rounded-lg">
              <p className="text-khaki-400 text-sm leading-relaxed">
                <strong className="text-khaki-200">Poznámka:</strong> Klub nemá
                vlastní střelnici. Akce pořádáme na různých střelnicích v
                regionu podle konkrétního programu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
