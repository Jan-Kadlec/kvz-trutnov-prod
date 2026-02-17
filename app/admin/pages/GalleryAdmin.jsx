import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/admin/apiGallery");
      const data = await res.json();
      setGallery(data.map((g) => ({ id: g._id, ...g })));
    }
    load();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Opravdu chcete smazat tuto fotografii?")) {
      setGallery(gallery.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.image_url) {
      alert("Vyplňte všechna povinná pole");
      return;
    }

    if (editingId) {
      setGallery(
        gallery.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item,
        ),
      );
      alert("Fotografie byla aktualizována");
    } else {
      const newItem = {
        id: Math.max(...gallery.map((g) => g.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString().split("T")[0],
        author: "admin",
        event_id: 1,
      };
      setGallery([...gallery, newItem]);
      alert("Nová fotografie byla přidána");
    }

    setFormData({ title: "", description: "", image_url: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-military font-bold text-khaki-100 mb-2">
            Fotogalerie
          </h1>
          <p className="text-khaki-400">Spravujte fotografie z akcí</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nová fotografie
        </button>
      </div>

      {showForm && (
        <div className="bg-military-800 border border-olive-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-military font-bold text-khaki-100 mb-4">
            {editingId ? "Upravit fotografii" : "Nová fotografie"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-1">
                Název fotografie *
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
                Popis
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-1">
                URL obrázku *
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                placeholder="https://..."
              />
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
                  setFormData({ title: "", description: "", image_url: "" });
                }}
                className="px-4 py-2 bg-military-700 hover:bg-military-600 text-khaki-100 font-medium rounded transition-colors"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-military-800 border border-olive-800 rounded-lg overflow-hidden group"
          >
            <div className="relative h-48 bg-military-900">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              />
            </div>

            <div className="p-4">
              <h3 className="text-khaki-100 font-medium mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-khaki-500 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              <p className="text-khaki-600 text-xs mb-3">
                {new Date(item.created_at).toLocaleDateString("cs-CZ")}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-olive-700/20 hover:bg-olive-700/40 text-olive-400 rounded transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Upravit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Smazat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loader: return mock gallery list for server GET
export async function loader() {
  return null;
}
