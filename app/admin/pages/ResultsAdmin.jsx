import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function ResultsAdmin() {
  const [results, setResults] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_name: "",
    location: "",
    event_date: "",
    proposition_pdf_url: null,
    results_pdf_url: null,
    photos_url: null,
  });
  const [loading, setLoading] = useState(false);

  // ===== LOAD =====
  const loadResults = async () => {
    const response = await fetch("/admin/apiResults");
    const data = await response.json();
    setResults(data.map((item) => ({ id: item._id, ...item })));
  };

  useEffect(() => {
    loadResults();
  }, []);

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("Opravdu chcete smazat tento záznam?")) return;

    await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "delete", id }),
    });

    setResults((prev) => prev.filter((n) => n.id !== id));
  };

  // ===== CREATE / UPDATE =====
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => {
        // reader.result is like "data:<type>;base64,..."
        const result = reader.result;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const makeFileObj = async (file) => {
    if (!file) return null;
    const content = await fileToBase64(file);
    return { name: file.name, type: file.type, content };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert file inputs to base64 payloads (only if provided)
      const proposition_pdf = await makeFileObj(formData.proposition_pdf_url);
      const results_pdf = await makeFileObj(formData.results_pdf_url);
      const photos = await makeFileObj(formData.photos_url);

      const payload = {
        type: editingId ? "update" : "create",
        id: editingId,
        event_name: formData.event_name,
        location: formData.location,
        event_date: formData.event_date,
        proposition_pdf,
        results_pdf,
        photos,
      };

      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await loadResults();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        event_name: "",
        location: "",
        event_date: "",
        proposition_pdf_url: null,
        results_pdf_url: null,
        photos_url: null,
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
    // keep file inputs empty when editing — only upload new files if user picks them
    setFormData({
      event_name: item.event_name || "",
      location: item.location || "",
      event_date: item.event_date || "",
      proposition_pdf_url: null,
      results_pdf_url: null,
      photos_url: null,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-military font-bold text-khaki-100 mb-2">
            Výsledky
          </h1>
          <p className="text-khaki-400">
            Spravujte výsledky, propozice a fotografie
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-olive-700 hover:bg-olive-600 text-khaki-100 font-medium rounded transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nový záznam
        </button>
      </div>

      {showForm && (
        <div className="bg-military-800 border border-olive-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-military font-bold text-khaki-100 mb-4">
            {editingId ? "Upravit výsledky" : "Nové výsledky"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  Název akce *
                </label>
                <input
                  type="text"
                  value={formData.event_name}
                  onChange={(e) =>
                    setFormData({ ...formData, event_name: e.target.value })
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
                Datum a čas *
              </label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
                className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  URL Propozice
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proposition_pdf_url: e.target.files[0],
                    })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  URL Výsledky
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      results_pdf_url: e.target.files[0],
                    })
                  }
                  className="w-full px-3 py-2 bg-military-900 border border-olive-800 rounded text-khaki-100 focus:border-olive-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-khaki-200 mb-1">
                  URL Fotogalerie
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, photos_url: e.target.files[0] })
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
                    event_name: "",
                    location: "",
                    event_date: "",
                    proposition_pdf_url: null,
                    results_pdf_url: null,
                    photos_url: null,
                  });
                }}
                className="px-4 py-2 bg-military-700 hover:bg-military-600 text-khaki-100 font-medium rounded transition-colors"
              >
                Zrušit
              </button>
            </div>

            {/* delete single asset handler */}
            <script />
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-olive-800">
              <th className="text-left py-3 px-4 text-khaki-300 font-medium">
                Akce
              </th>
              <th className="text-left py-3 px-4 text-khaki-300 font-medium">
                Datum
              </th>
              <th className="text-left py-3 px-4 text-khaki-300 font-medium">
                Místo
              </th>
              <th className="text-center py-3 px-4 text-khaki-300 font-medium">
                Propozice
              </th>
              <th className="text-center py-3 px-4 text-khaki-300 font-medium">
                Výsledky
              </th>
              <th className="text-center py-3 px-4 text-khaki-300 font-medium">
                Foto
              </th>
              <th className="text-right py-3 px-4 text-khaki-300 font-medium">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr
                key={item.id}
                className="border-b border-olive-800 hover:bg-military-700"
              >
                <td className="py-3 px-4 text-khaki-100">{item.event_name}</td>
                <td className="py-3 px-4 text-khaki-400 text-xs">
                  {new Date(item.event_date).toLocaleDateString("cs-CZ")}
                </td>
                <td className="py-3 px-4 text-khaki-400">{item.location}</td>
                <td className="py-3 px-4 text-center">
                  {item.proposition_pdf_url &&
                  item.proposition_pdf_url.asset ? (
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={item.proposition_pdf_url.asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-khaki-100 underline text-xs"
                      >
                        {item.proposition_pdf_url.asset.originalFilename ||
                          "Stáhnout"}
                      </a>
                      <button
                        onClick={async () => {
                          if (!confirm("Opravdu smazat tento soubor?")) return;
                          setLoading(true);
                          try {
                            await fetch("/api/results", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                type: "deleteAsset",
                                id: item.id,
                                field: "proposition_pdf_url",
                                assetId: item.proposition_pdf_url.asset._id,
                                deleteAsset: true,
                              }),
                            });
                            await loadResults();
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-khaki-600">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.results_pdf_url && item.results_pdf_url.asset ? (
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={item.results_pdf_url.asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-khaki-100 underline text-xs"
                      >
                        {item.results_pdf_url.asset.originalFilename ||
                          "Stáhnout"}
                      </a>
                      <button
                        onClick={async () => {
                          if (!confirm("Opravdu smazat tento soubor?")) return;
                          setLoading(true);
                          try {
                            await fetch("/api/results", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                type: "deleteAsset",
                                id: item.id,
                                field: "results_pdf_url",
                                assetId: item.results_pdf_url.asset._id,
                                deleteAsset: true,
                              }),
                            });
                            await loadResults();
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-khaki-600">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.photos_url && item.photos_url.asset ? (
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={item.photos_url.asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-khaki-100 underline text-xs"
                      >
                        {item.photos_url.asset.originalFilename || "Stáhnout"}
                      </a>
                      <button
                        onClick={async () => {
                          if (!confirm("Opravdu smazat tento soubor?")) return;
                          setLoading(true);
                          try {
                            await fetch("/api/results", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                type: "deleteAsset",
                                id: item.id,
                                field: "photos_url",
                                assetId: item.photos_url.asset._id,
                                deleteAsset: true,
                              }),
                            });
                            await loadResults();
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-khaki-600">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-olive-700/20 hover:bg-olive-700/40 text-olive-400 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Loader: return mock results for server GET
export async function loader() {
  return null;
}
