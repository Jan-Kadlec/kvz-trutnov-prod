import { Target, Users, Award, Calendar } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: Target,
      title: "Sportovní střelba",
      description:
        "Zaměřujeme se na rozvoj střeleckých dovedností a sportovní výkon našich členů.",
    },
    {
      icon: Users,
      title: "Komunita",
      description:
        "Jsme soudržná komunita střelců a veteránů s dlouholetou tradicí.",
    },
    {
      icon: Award,
      title: "Soutěže",
      description:
        "Pravidelně pořádáme a účastníme se střeleckých soutěží a závodů.",
    },
    {
      icon: Calendar,
      title: "Akce",
      description:
        "Organizujeme pravidelná soustředění a střelecké akce po celém roce.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-military-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Kdo jsme
          </span>
          <h2 className="text-4xl sm:text-5xl font-military font-bold text-khaki-100 mt-4 mb-6">
            O klubu
          </h2>
          <div className="w-24 h-1 bg-olive-600 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-military font-bold text-khaki-100 mb-4">
              Historie a poslání
            </h3>
            <p className="text-khaki-300 leading-relaxed mb-4">
              Náš Klub vojáků v záloze Trutnov 2 byl založen dne 15. 12. 1995
              oddělením od KVZ Trutnov 1 se šesti zakládajícími členy. Postupem
              let se členská základna ustálila na počtu čtrnácti členů, mezi
              nimiž jsou čtyři rozhodčí II. třídy a jeden rozhodčí III. třídy.
              Již tradičně pořádáme střeleckou soutěž „Velikonoční cena“ na
              střelnici v Hostinném a zároveň organizujeme různé sportovní a
              společenské akce pro rodinné příslušníky. Dříve jsme se společně
              věnovali plavání, dnes se setkáváme při bowlingu a rodinném
              střílení.
            </p>
            <p className="text-khaki-300 leading-relaxed mb-4">
              Každoročně pořádáme přibližně sedm klubových akcí a pravidelně se
              účastníme soutěží a aktivit dalších střeleckých klubů v okrese
              Trutnov i mimo něj. Vlastní střelnici nemáme, proto využíváme
              střelnice ve Střední lesnické škole v Trutnově, v Nových Lesích u
              Dvora Králové, ve Vrchlabí a v Hostinném. Naším cílem není mít co
              nejvíce členů, ale vytvářet menší, soudržný kolektiv, kde se dobře
              známe nejen mezi sebou, ale i v rámci našich rodin.
            </p>
            <p className="text-khaki-300 leading-relaxed">
              Jsme hrdí na naši tradici, kázeň a přátelskou atmosféru, která
              panuje mezi našimi členy. Vítáme všechny, kdo sdílejí naši vášeň
              pro střelbu a vojenské hodnoty.
            </p>
          </div>

          <div>
            <div
              className="h-full min-h-100 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  "url(https://img41.rajce.idnes.cz/d4102/17/17786/17786863_359f2e36e72adb1d031cbd28330e8786/thumb/IMG_20220402_095535.jpg)",
              }}
              role="img"
              aria-hidden="true"
            >
              {" "}
              <img
                src="https://img41.rajce.idnes.cz/d4102/17/17786/17786863_359f2e36e72adb1d031cbd28330e8786/thumb/IMG_20220402_095535.jpg"
                alt="Historické a společenské setkání klubu KVZ Trutnov 2"
                className="sr-only"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-military-900 border border-olive-800 rounded-lg p-6 hover:border-olive-600 transition-colors"
              >
                <div className="bg-olive-700/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-olive-400" />
                </div>
                <h4 className="text-lg font-military font-bold text-khaki-100 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-khaki-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
