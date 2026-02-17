import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@kvztrutnov2.cz",
      link: "mailto:info@kvztrutnov2.cz",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: "+420 123 456 789",
      link: "tel:+420123456789",
    },
    {
      icon: MapPin,
      label: "Adresa",
      value: "Trutnov, Královéhradecký kraj",
      link: null,
    },
    {
      icon: Clock,
      label: "Dostupnost",
      value: "Po-Pá: 9:00 - 17:00",
      link: null,
    },
  ];

  return (
    <section id="contact" className="py-24 bg-military-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Spojte se s námi
          </span>
          <h2 className="text-4xl sm:text-5xl font-military font-bold text-khaki-100 mt-4 mb-6">
            Kontakt
          </h2>
          <div className="w-24 h-1 bg-olive-600 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Levá část - kontaktní údaje */}
          <div>
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
                  <div className="flex items-start space-x-4 p-4 bg-military-800 border border-olive-800 rounded-lg hover:border-olive-600 transition-colors">
                    <div className="bg-olive-700/20 p-3 rounded-lg shrink-0">
                      <Icon className="w-6 h-6 text-olive-400" />
                    </div>
                    <div>
                      <div className="text-sm text-khaki-500 uppercase tracking-wider mb-1">
                        {item.label}
                      </div>
                      <div className="text-khaki-100 font-medium">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );

                return item.link ? (
                  <a key={index} href={item.link} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-olive-900/20 border border-olive-800 rounded-lg">
              <h4 className="text-lg font-military font-bold text-khaki-100 mb-3">
                Chcete se stát členem?
              </h4>
              <p className="text-khaki-400 text-sm leading-relaxed mb-4">
                Pokud máte zájem o členství v našem klubu, kontaktujte nás
                pomocí výše uvedených kontaktů. Rádi vám poskytneme všechny
                potřebné informace o členství a našich aktivitách.
              </p>
            </div>
          </div>

          {/* Pravá část - mapa */}
          <div>
            <h3 className="text-2xl font-military font-bold text-khaki-100 mb-6">
              Kde nás najdete
            </h3>
            <div className="bg-military-800 border border-olive-800 rounded-lg overflow-hidden h-125">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40692.90245524267!2d15.876299999999998!3d50.56101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470e9c5c2b1b8d45%3A0x400af0f66164090!2sTrutnov!5e0!3m2!1scs!2scz!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa - Trutnov"
              ></iframe>
            </div>

            <div className="mt-6 p-4 bg-military-800 border border-olive-800 rounded-lg">
              <p className="text-khaki-400 text-sm">
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
