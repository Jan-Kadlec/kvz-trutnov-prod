import { useEffect, useState } from "react";
import { Calendar, X, ExternalLink } from "lucide-react";
import { client } from "../sanity/client";

const NEWS_QUERY = `
*[_type == "news"] | order(published_at desc) {
  _id,
  title,
  published_at,
  excerpt,
  content,
  "image": image.asset->url
}
`;

const ITEMS_PER_PAGE = 3;

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    client
      .fetch(NEWS_QUERY)
      .then((data) => {
        setNews(
          data.map((item) => ({
            id: item._id,
            ...item,
          })),
        );
      })
      .catch((err) => console.error("Chyba při načítání:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));

  const visibleNews = news.slice(0, visibleCount);

  return (
    <section id="news" className="py-24 bg-military-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Novinky
          </span>
          <h2 className="text-4xl font-military font-bold text-khaki-100 mt-4">
            Aktuality
          </h2>
        </div>
        <div className="w-24 h-1 bg-olive-600 mx-auto mb-16"></div>

        {loading ? (
          <p className="text-center text-khaki-400">Načítání…</p>
        ) : news.length === 0 ? (
          <p className="text-center text-khaki-400">
            Zatím nejsou k dispozici žádné aktuality.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleNews.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className="cursor-pointer text-left bg-military-800 border border-olive-800 rounded-lg p-6 hover:border-olive-500 transition"
                >
                  <div className="flex items-center text-xs text-khaki-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(item.published_at)}
                  </div>

                  <h3 className="text-lg font-bold text-khaki-100 mb-4">
                    {item.title}
                  </h3>

                  <div className="flex items-center text-olive-400 text-sm font-medium">
                    Zobrazit aktuality
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </div>
                </button>
              ))}
            </div>

            {visibleCount < news.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="px-6 py-3 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition"
                >
                  Načíst další
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== MODAL / FULLSCREEN VIEW ===== */}
      {activeItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-military-800 border-2 border-olive-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-military-800 border-b border-olive-700 p-6 flex items-start justify-between">
              <div>
                <div className="inline-block bg-olive-700 text-khaki-100 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Aktualita
                </div>
                <h2 className="text-3xl font-military font-bold text-khaki-100">
                  {activeItem.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-khaki-400 hover:text-khaki-100 transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Date */}
              <div className="flex items-center text-khaki-100">
                <Calendar className="w-6 h-6 mr-3 text-olive-500" />
                <span className="font-medium">
                  {formatDate(activeItem.published_at)}
                </span>
              </div>

              {/* Image */}
              {activeItem.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Excerpt */}
              {activeItem.excerpt && (
                <div>
                  <h3 className="text-lg font-military font-bold text-khaki-100 mb-3">
                    Souhrn
                  </h3>
                  <p className="text-khaki-300 leading-relaxed">
                    {activeItem.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              {activeItem.content && (
                <div>
                  <h3 className="text-lg font-military font-bold text-khaki-100 mb-3">
                    Podrobnosti
                  </h3>
                  <p className="text-khaki-300 leading-relaxed whitespace-pre-wrap">
                    {activeItem.content}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-olive-800">
                <button
                  onClick={() => setActiveItem(null)}
                  className="w-full px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
                >
                  Zavřít
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
