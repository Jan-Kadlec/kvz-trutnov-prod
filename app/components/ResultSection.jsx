import { useEffect, useState } from "react";
import {
  FileText,
  Image,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { client } from "../sanity/client";

/**
 * @typedef {{
 *   id: string,
 *   event_name: string,
 *   event_date: string,
 *   location: string,
 *   proposition_pdf_url: string | null,
 *   results_pdf_url: string | null,
 *   photos_url: string[]
 * }} ResultItem
 */

export default function ResultsSection() {
  const [results, setResults] = useState(/** @type {ResultItem[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeGallery, setActiveGallery] = useState(
    /** @type {{ id: string, photoIndex: number } | null} */ (null),
  );

  const RESULTS_QUERY = `
*[_type == "result"] | order(event_date desc) {
  _id,
  event_name,
  event_date,
  location,

  "proposition_pdf_url": proposition_pdf_url.asset->url,
  "results_pdf_url": results_pdf_url.asset->url,
  "photos_url": photos_url[] {
    asset-> {
      url
    }
  }
}
`;

  useEffect(() => {
    client
      .fetch(RESULTS_QUERY)
      .then((data) => {
        /** @type {ResultItem[]} */
        const normalizedResults = data.map(
          /** @param {any} item */
          (item) => ({
            id: item._id,

            event_name: item.event_name,
            event_date: item.event_date,
            location: item.location ?? "",

            proposition_pdf_url: item.proposition_pdf_url ?? null,
            results_pdf_url: item.results_pdf_url ?? null,
            photos_url: Array.isArray(item.photos_url)
              ? item.photos_url
                  .map(
                    /** @param {any} photo */
                    (photo) => photo?.asset?.url ?? photo?.url ?? null,
                  )
                  .filter(Boolean)
              : item.photos_url
                ? [item.photos_url]
                : [],
          }),
        );

        setResults(normalizedResults);
      })
      .catch((err) => console.error("Chyba při načítání výsledků:", err))
      .finally(() => setLoading(false));
  }, []);

  /** @param {string} dateString */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const activeResult =
    activeGallery && results.find((result) => result.id === activeGallery.id);
  const activePhotoCount = activeResult?.photos_url?.length || 0;
  const activePhoto =
    activeResult?.photos_url?.[activeGallery?.photoIndex ?? 0] || null;

  const goToPreviousPhoto = () => {
    if (!activeResult || activePhotoCount === 0) return;
    setActiveGallery((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        photoIndex:
          prev.photoIndex > 0 ? prev.photoIndex - 1 : activePhotoCount - 1,
      };
    });
  };

  const goToNextPhoto = () => {
    if (!activeResult || activePhotoCount === 0) return;
    setActiveGallery((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        photoIndex:
          prev.photoIndex < activePhotoCount - 1 ? prev.photoIndex + 1 : 0,
      };
    });
  };

  return (
    <section id="results" className="py-24 bg-military-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Archiv
          </span>
          <h2 className="text-4xl sm:text-5xl font-military font-bold text-khaki-100 mt-4 mb-6">
            Výsledky & Fotogalerie
          </h2>
          <div className="w-24 h-1 bg-olive-600 mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-khaki-400">
              Výsledky a fotografie budou brzy k dispozici.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-olive-700">
                    <th className="text-left py-4 px-4 text-khaki-200 font-military uppercase tracking-wider text-sm">
                      Datum
                    </th>
                    <th className="text-left py-4 px-4 text-khaki-200 font-military uppercase tracking-wider text-sm">
                      Místo
                    </th>
                    <th className="text-left py-4 px-4 text-khaki-200 font-military uppercase tracking-wider text-sm">
                      Akce
                    </th>
                    <th className="text-center py-4 px-4 text-khaki-200 font-military uppercase tracking-wider text-sm">
                      Propozice
                    </th>
                    <th className="text-center py-4 px-4 text-khaki-200 font-military uppercase tracking-wider text-sm">
                      Výsledky
                    </th>
                    <th className="text-center py-4 px-4 text-khaki-200 font-military uppercase tracking-wider text-sm">
                      Foto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, visibleCount).map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-olive-800 hover:bg-military-900 transition-colors"
                    >
                      <td className="py-4 px-4 text-khaki-300 whitespace-nowrap">
                        {formatDate(result.event_date)}
                      </td>
                      <td className="py-4 px-4 text-khaki-300">
                        {result.location}
                      </td>
                      <td className="py-4 px-4 text-khaki-100 font-medium">
                        {result.event_name}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {result.proposition_pdf_url ? (
                          <a
                            href={result.proposition_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-olive-400 hover:text-olive-300 transition-colors"
                            aria-label={`Propozice - ${result.event_name} (${formatDate(result.event_date)})`}
                          >
                            <FileText className="w-5 h-5" />
                            <span className="sr-only">
                              Propozice: {result.event_name}
                            </span>
                          </a>
                        ) : (
                          <span className="text-khaki-600">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {result.results_pdf_url ? (
                          <a
                            href={result.results_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-olive-400 hover:text-olive-300 transition-colors"
                            aria-label={`Výsledky - ${result.event_name} (${formatDate(result.event_date)})`}
                          >
                            <Download className="w-5 h-5" />
                            <span className="sr-only">
                              Výsledky: {result.event_name}
                            </span>
                          </a>
                        ) : (
                          <span className="text-khaki-600">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {result.photos_url.length > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveGallery({
                                id: result.id,
                                photoIndex: 0,
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-full bg-olive-700/20 px-3 py-2 text-olive-400 hover:bg-olive-700/40 transition-colors"
                            aria-label={`Fotogalerie - ${result.event_name} (${formatDate(result.event_date)})`}
                          >
                            <span className="text-sm font-semibold text-khaki-100">
                              {result.photos_url.length}
                            </span>
                            <Image className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="text-khaki-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load More / Close Buttons */}
            {results.length > 3 && (
              <div className="flex justify-center gap-4 mt-8">
                {visibleCount < results.length && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    className="px-6 py-3 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
                  >
                    Zobrazit více
                  </button>
                )}
                {visibleCount > 3 && (
                  <button
                    onClick={() => setVisibleCount(3)}
                    className="px-6 py-3 bg-military-700 hover:bg-military-600 text-khaki-100 font-medium rounded transition-colors"
                  >
                    Zavřít
                  </button>
                )}
              </div>
            )}

            {activeGallery && activeResult && activePhoto ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="relative w-full max-w-4xl rounded-2xl border border-olive-700 bg-military-900 p-4 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => setActiveGallery(null)}
                    className="absolute right-3 top-3 rounded-full bg-military-700 p-2 text-khaki-100 hover:bg-military-600"
                    aria-label="Zavřít galerii"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between gap-3 px-2 pb-3 pt-2">
                    <div>
                      <p className="text-sm text-olive-400">
                        {activeResult.event_name}
                      </p>
                      <p className="text-xs text-khaki-400">
                        {activeGallery.photoIndex + 1} / {activePhotoCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousPhoto}
                      className="rounded-full bg-olive-700 p-3 text-khaki-100 hover:bg-olive-600"
                      aria-label="Předchozí fotografie"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex-1 overflow-hidden rounded-xl bg-military-800">
                      <img
                        src={activePhoto}
                        alt={`${activeResult.event_name} ${activeGallery.photoIndex + 1}`}
                        className="max-h-[70vh] w-full object-contain"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={goToNextPhoto}
                      className="rounded-full bg-olive-700 p-3 text-khaki-100 hover:bg-olive-600"
                      aria-label="Další fotografie"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-8 p-6 bg-military-900 border border-olive-800 rounded-lg">
              <div className="flex items-start space-x-4">
                <FileText className="w-6 h-6 text-olive-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-military font-bold text-khaki-100 mb-2">
                    Legenda
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-olive-400" />
                      <span className="text-khaki-300">Propozice</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-olive-400" />
                      <span className="text-khaki-300">Výsledky</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Image className="w-4 h-4 text-olive-400" />
                      <span className="text-khaki-300">Fotogalerie</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
