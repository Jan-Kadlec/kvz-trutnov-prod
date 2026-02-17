import { useEffect, useState } from "react";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { client } from "../sanity/client";

const EVENTS_QUERY = `
*[_type == "event"] | order(event_date desc) {
  _id,
  title,
  description,
  location,
  event_date,
  featured
}
`;

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    client
      .fetch(EVENTS_QUERY)
      .then((data) => {
        setEvents(
          data.map((item) => ({
            id: item._id,
            title: item.title,
            description: item.description,
            location: item.location,
            event_date: item.event_date,
            featured: item.featured || false,
          })),
        );
      })
      .catch((err) => console.error("Chyba při načítání akcí:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const upcomingEvents = events.filter((event) => isUpcoming(event.event_date));
  const pastEvents = events.filter((event) => !isUpcoming(event.event_date));

  return (
    <section id="events" className="py-24 bg-military-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-olive-400 font-military text-sm tracking-[0.3em] uppercase">
            Kalendář
          </span>
          <h2 className="text-4xl sm:text-5xl font-military font-bold text-khaki-100 mt-4 mb-6">
            Nadcházející akce
          </h2>
          <div className="w-24 h-1 bg-olive-600 mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div>
          </div>
        ) : (
          <>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 mb-12">
                <p className="text-khaki-400">
                  V tuto chvíli nejsou naplánovány žádné akce.
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6 mb-16">
                {upcomingEvents.map((event) => (
                  <article
                    onClick={() => setSelectedEvent(event)}
                    key={event.id}
                    data-event-id={event.id}
                    data-event-title={event.title}
                    data-event-date={event.event_date}
                    data-event-location={event.location}
                    className="bg-military-800 border-2 border-olive-700 rounded-lg p-6 hover:border-olive-500 transition-all group"
                    aria-labelledby={`event-title-${event.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="inline-block bg-olive-700 text-khaki-100 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                          Nadcházející
                        </div>
                        <h3
                          id={`event-title-${event.id}`}
                          className="text-2xl font-military font-bold text-khaki-100 mb-3 group-hover:text-olive-400 transition-colors"
                        >
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-khaki-300">
                        <Calendar className="w-5 h-5 mr-3 text-olive-500" />
                        <span className="font-medium">
                          {formatDate(event.event_date)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{formatTime(event.event_date)}</span>
                      </div>
                      <div className="flex items-center text-khaki-300">
                        <MapPin className="w-5 h-5 mr-3 text-olive-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-khaki-400 leading-relaxed mb-4">
                      {event.description}
                    </p>

                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex items-center text-olive-400 hover:text-olive-300 font-medium transition-colors group"
                      aria-label={`Detail akce ${event.title}`}
                    >
                      <span>Detail akce: {event.title}</span>
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </article>
                ))}
              </div>
            )}

            {pastEvents.length > 0 && (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-military font-bold text-khaki-100">
                    Proběhlé akce
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.slice(0, 6).map((event) => (
                    <div
                      key={event.id}
                      className="bg-military-800 border border-olive-800 rounded-lg p-6 opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <h4 className="text-lg font-military font-bold text-khaki-100 mb-2">
                        {event.title}
                      </h4>
                      <div className="flex items-center text-sm text-khaki-400 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-khaki-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-military-800 border-2 border-olive-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-military-800 border-b border-olive-700 p-6 flex items-start justify-between">
              <div>
                <div className="inline-block bg-olive-700 text-khaki-100 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Nadcházející
                </div>
                <h2 className="text-3xl font-military font-bold text-khaki-100">
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-khaki-400 hover:text-khaki-100 transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Date and Time */}
              <div className="space-y-3">
                <div className="flex items-center text-khaki-100">
                  <Calendar className="w-6 h-6 mr-3 text-olive-500" />
                  <div>
                    <span className="font-medium">
                      {formatDate(selectedEvent.event_date)}
                    </span>
                    <span className="mx-3 text-khaki-400">•</span>
                    <span>{formatTime(selectedEvent.event_date)}</span>
                  </div>
                </div>
                <div className="flex items-center text-khaki-100">
                  <MapPin className="w-6 h-6 mr-3 text-olive-500" />
                  <span className="font-medium">{selectedEvent.location}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-military font-bold text-khaki-100 mb-3">
                  Podrobnosti
                </h3>
                <p className="text-khaki-300 leading-relaxed text-base">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-olive-800">
                <button
                  onClick={() => setSelectedEvent(null)}
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
