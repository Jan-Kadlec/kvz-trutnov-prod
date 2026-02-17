import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    featured: false,
  });

  // ===== LOAD =====
  const loadEvents = async () => {
    const response = await fetch("/admin/apiEvents");
    const data = await response.json();
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
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      location: item.location,
      event_date: item.event_date ? item.event_date.slice(0, 16) : "",
      featured: item.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Opravdu chcete smazat tuto akci?")) return;

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delete", id }),
    });

    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.event_date
    ) {
      alert("Vyplňte všechna povinná pole");
      return;
    }

    const payload = {
      type: editingId ? "update" : "create",
      id: editingId,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      event_date: formData.event_date,
      featured: formData.featured,
    };

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await loadEvents();
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      event_date: "",
      featured: false,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-military font-bold text-khaki-100 mb-2">
            Akce
          </h1>
          <p className="text-khaki-400">Spravujte klubové akce a soustředění</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              description: "",
              location: "",
              event_date: "",
              featured: false,
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nová akce
        </button>
      </div>

      {showForm && (
        <div className="bg-military-800 border border-olive-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-military font-bold text-khaki-100 mb-4">
            {editingId ? "Upravit akci" : "Nová akce"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  Název *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  Místo *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-1">
                Popis *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  Datum a čas *
                </label>
                <input
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-khaki-200 mb-1">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="mr-2 w-4 h-4 rounded border-olive-800 accent-olive-600"
                  />
                  Zvýraznit akci
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
              >
                {editingId ? "Aktualizovat" : "Přidat"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    description: "",
                    location: "",
                    event_date: "",
                    featured: false,
                  });
                }}
                className="px-4 py-2 bg-military-700 hover:bg-military-600 text-khaki-100 font-medium rounded transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {events.map((item) => (
          <div
            key={item.id}
            className="bg-military-800 border border-olive-800 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-khaki-100 font-medium">{item.title}</h3>
              {item.featured && (
                <span className="px-2 py-1 text-xs font-bold rounded bg-olive-700/30 text-olive-300">
                  Zvýraznená
                </span>
              )}
            </div>

            <p className="text-khaki-500 text-sm mb-2">{item.description}</p>

            <div className="flex items-center justify-between text-xs text-khaki-600 mb-3">
              <span>
                📍 {item.location} • 📅{" "}
                {new Date(item.event_date).toLocaleDateString("cs-CZ")}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 bg-olive-700/20 hover:bg-olive-700/40 text-olive-400 rounded transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
