import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: null,
    published_at: "",
  });

  // ===== LOAD =====
  const loadNews = async () => {
    const response = await fetch("/admin/apiNews");
    const data = await response.json();
    setNews(data.map((item) => ({ id: item._id, ...item })));
  };

  useEffect(() => {
    loadNews();
  }, []);

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("Opravdu chcete smazat tuto aktualitu?")) return;

    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delete", id }),
    });

    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  // ===== CREATE / UPDATE =====
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const makeImageObj = async (file) => {
    if (!file) return null;
    const content = await fileToBase64(file);
    return { name: file.name, type: file.type, content };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const image = await makeImageObj(formData.image);

      const payload = {
        type: editingId ? "update" : "create",
        id: editingId,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image,
        published_at: formData.published_at || new Date().toISOString(),
      };

      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await loadNews();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: null,
        published_at: "",
      });
    } catch (err) {
      console.error("Submit error:", err);
      alert("Chyba při nahrávání: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt || "",
      content: item.content || "",
      image: null,
      published_at: item.published_at ? item.published_at.slice(0, 16) : "",
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-military font-bold text-khaki-100 mb-2">
            Aktuality
          </h1>
          <p className="text-khaki-400">Spravujte aktuality a články</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              excerpt: "",
              content: "",
              image: null,
              published_at: "",
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nová aktualita
        </button>
      </div>

      {showForm && (
        <div className="bg-military-800 border border-olive-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-military font-bold text-khaki-100 mb-4">
            {editingId ? "Upravit aktualitu" : "Nová aktualita"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-1">
                Nadpis *
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
                Krátký popis
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows="2"
                className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-khaki-200 mb-1">
                Obsah *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows="6"
                className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  Hlavní obrázek
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  Datum publikace
                </label>
                <input
                  type="datetime-local"
                  value={
                    formData.published_at == null || formData.published_at == ""
                      ? new Date().toISOString().slice(0, 16)
                      : formData.published_at
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, published_at: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
              >
                {loading
                  ? editingId
                    ? "Aktualizuji..."
                    : "Nahrávám..."
                  : editingId
                    ? "Aktualizovat"
                    : "Přidat"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    excerpt: "",
                    content: "",
                    image: null,
                    published_at: "",
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-olive-800">
              <th className="text-left py-3 px-4 text-khaki-300 font-medium">
                Nadpis
              </th>
              <th className="text-left py-3 px-4 text-khaki-300 font-medium">
                Datum
              </th>
              <th className="text-left py-3 px-4 text-khaki-300 font-medium">
                Autor
              </th>
              <th className="text-right py-3 px-4 text-khaki-300 font-medium">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-b border-olive-800">
                <td className="py-3 px-4 text-khaki-100 font-medium">
                  {item.title}
                </td>
                <td className="py-3 px-4 text-khaki-600 text-sm">
                  {new Date(item.published_at).toLocaleDateString("cs-CZ")}
                </td>
                <td className="py-3 px-4 text-khaki-600 text-sm">
                  {item.author || "admin"}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
