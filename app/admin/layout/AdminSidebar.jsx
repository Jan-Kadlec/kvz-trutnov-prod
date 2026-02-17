import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Trophy,
  Images,
  X,
} from "lucide-react";

const navItems = [
  {
    id: "dashboard",
    label: "Přehled",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    id: "news",
    label: "Aktuality",
    icon: FileText,
    href: "/admin/news",
  },
  {
    id: "events",
    label: "Akce",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    id: "results",
    label: "Výsledky",
    icon: Trophy,
    href: "/admin/results",
  },
  {
    id: "gallery",
    label: "Fotogalerie",
    icon: Images,
    href: "/admin/gallery",
  },
];

export function AdminSidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-military-800 border-r border-olive-800 transition-transform duration-300 z-40 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-olive-800 md:hidden">
          <span className="text-khaki-100 font-military font-bold">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-military-700 rounded text-khaki-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-olive-700 text-khaki-100"
                    : "text-khaki-400 hover:bg-military-700 hover:text-khaki-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-olive-800 bg-military-900">
          <div className="text-xs text-khaki-600">
            <p className="mb-2">Demo přihlášení:</p>
            <p className="font-mono text-khaki-500">admin</p>
            <p className="font-mono text-khaki-500">admin123</p>
          </div>
        </div>
      </aside>
    </>
  );
}
