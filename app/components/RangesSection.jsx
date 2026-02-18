import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function RangesSection() {
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statická data místo DB
  const staticRanges = [
    {
      id: 1,
      name: "Střední lesnická škola Trutnov",
      description: "Veřejná pistolová střelnice 2 x 25 m",
      image_url:
        "https://strelnice.clatrutnov.cz/images/fotky/trutnov/strelnice-trutnov-5.jpg",
    },
    {
      id: 2,
      name: "SSK Nové Lesy",
      description: "Veřejná střelnice 25 a 50 m. Otevřeno: neděle 12-18 h.",
      image_url:
        "https://d48-a.sdn.cz/d_48/c_img_oZ_A/kBkJRwehYQKXlBRJDKIeAJ/bd40.jpeg?fl=res,600,,1,ffffff",
    },
    {
      id: 3,
      name: "SBTS Hostinné",
      description: "Střelnice 25 a 40 m",
      image_url:
        "https://lh6.googleusercontent.com/proxy/QGe87c4gWg9zyhXPevvxF1505rYSfK6qsUeKW0MANXWW5DmeETcWRgugTMxPhlw05JXaviAulwSteyXcZFz7TdWW",
    },
    {
      id: 4,
      name: "SSK Vrchlabí",
      description: "Veřejná střelnice 25 a 50 m",
      image_url:
        "https://www.google.com/imgres?q=ssk%20vrchlab%C3%AD%20strelnice&imgurl=https%3A%2F%2Fd48-a.sdn.cz%2Fd_48%2Fc_img_QP_BK%2FQ83B68.jpeg%3Ffl%3Dres%2C1200%2C900%2C1&imgrefurl=https%3A%2F%2Fwww.firmy.cz%2Fdetail%2F13661477-strelnice-ssk-skoda-vrchlabi-vrchlabi.html&docid=OP7RUzs57Rs-jM&tbnid=-CqubLYcHyf-fM&vet=12ahUKEwjxp8e87-KSAxU9hP0HHdWPFmoQnPAOegQIGRAB..i&w=1200&h=872&hcb=2&ved=2ahUKEwjxp8e87-KSAxU9hP0HHdWPFmoQnPAOegQIGRAB",
    },
  ];

  useEffect(() => {
    // Simulace načítání dat
    setTimeout(() => {
      setRanges(staticRanges);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section id="ranges" className="py-24 bg-military-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Kde střílíme
          </span>
          <h2 className="text-4xl sm:text-5xl font-military font-bold text-khaki-100 mt-4 mb-6">
            Střelnice
          </h2>
          <div className="w-24 h-1 bg-olive-600 mx-auto mb-6"></div>
          <p className="text-khaki-400 max-w-2xl mx-auto">
            Náš klub nemá vlastní střelnici, pravidelně však využíváme různé
            moderní střelecké areály v celém regionu.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div>
          </div>
        ) : ranges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-khaki-400">
              Fotografie střelnic budou brzy k dispozici.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranges.map((range) => (
              <article
                key={range.id}
                className="group relative overflow-hidden rounded-lg bg-military-900 border border-olive-800 hover:border-olive-600 transition-all"
                aria-labelledby={`range-title-${range.id}`}
              >
                <div
                  className="h-64 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${range.image_url})` }}
                  role="img"
                  aria-hidden="true"
                >
                  <img
                    src={range.image_url}
                    alt={`Střelnice: ${range.name}`}
                    className="sr-only"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-military-900 via-military-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3
                    id={`range-title-${range.id}`}
                    className="text-xl font-military font-bold text-khaki-100 mb-2"
                  >
                    {range.name}
                  </h3>
                  {range.description && (
                    <p className="text-sm text-khaki-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {range.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
