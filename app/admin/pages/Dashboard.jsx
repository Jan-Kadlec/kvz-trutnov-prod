import { useState, useEffect } from "react";
import { FileText, Calendar, Trophy, Images } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    results: 0,
    gallery: 0,
  });
  const [recentNews, setRecentNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [newsRes, eventsRes, resultsRes] = await Promise.all([
          fetch("/admin/apiNews"),
          fetch("/admin/apiEvents"),
          fetch("/admin/apiResults"),
        ]);
        const [newsData, eventsData, resultsData] = await Promise.all([
          newsRes.json(),
          eventsRes.json(),
          resultsRes.json(),
        ]);

        setStats({
          news: newsData.length,
          events: eventsData.length,
          results: resultsData.length,
          gallery: 0,
        });

        setRecentNews(newsData.slice(0, 3).map((n) => ({ id: n._id, ...n })));
        setUpcomingEvents(
          eventsData
            .filter((e) => new Date(e.event_date) > new Date())
            .slice(0, 3)
            .map((e) => ({ id: e._id, ...e })),
        );
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const cards = [
    {
      title: "Aktuality",
      count: stats.news,
      icon: FileText,
      bgColor: "bg-olive-900/30",
      borderColor: "border-olive-700",
      iconColor: "text-olive-400",
    },
    {
      title: "Akce",
      count: stats.events,
      icon: Calendar,
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-700",
      iconColor: "text-blue-400",
    },
    {
      title: "Výsledky",
      count: stats.results,
      icon: Trophy,
      bgColor: "bg-amber-900/30",
      borderColor: "border-amber-700",
      iconColor: "text-amber-400",
    },
    {
      title: "Fotky",
      count: stats.gallery,
      icon: Images,
      bgColor: "bg-purple-900/30",
      borderColor: "border-purple-700",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-military font-bold text-khaki-100 mb-2">
          Přehled
        </h1>
        <p className="text-khaki-400">Statistika a přehled obsahu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} border ${card.borderColor} rounded-lg p-6 backdrop-blur`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-khaki-400 text-sm font-medium">
                    {card.title}
                  </p>
                  <p className="text-3xl font-military font-bold text-khaki-100 mt-2">
                    {card.count}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${card.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent news */}
        <div className="bg-military-800 border border-olive-800 rounded-lg p-6">
          <h2 className="text-xl font-military font-bold text-khaki-100 mb-4">
            Poslední aktuality
          </h2>
          <div className="space-y-3">
            {recentNews.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 pb-3 border-b border-olive-800 last:border-0"
              >
                <div className="w-2 h-2 bg-olive-500 rounded-full mt-2 shrink-0" />
                <div>
                  <p className="text-khaki-100 font-medium text-sm">
                    {item.title}
                  </p>
                  <p className="text-khaki-600 text-xs">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("cs-CZ")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-military-800 border border-olive-800 rounded-lg p-6">
          <h2 className="text-xl font-military font-bold text-khaki-100 mb-4">
            Nadcházející akce
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 pb-3 border-b border-olive-800 last:border-0"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0 flex flex-col gap-3" />
                <div>
                  <p className="text-khaki-100 font-medium text-lg">
                    Název: {item.title}
                  </p>
                  <p className="text-khaki-300 font-medium text-sm">
                    Popis: {item.description}
                  </p>
                  <p className="text-khaki-600 text-xs">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleDateString("cs-CZ")
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loader: framework requires loader to handle GET /admin/dashboard
export async function loader() {
  return null;
}
