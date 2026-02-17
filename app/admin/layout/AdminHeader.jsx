import { useNavigate } from "react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function AdminHeader({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const session = JSON.parse(sessionStorage.getItem("adminSession") || "{}");

  const handleLogout = () => {
    sessionStorage.removeItem("adminSession");
    navigate("/admin/login");
  };

  return (
    <header className="bg-military-900 border-b border-olive-800 sticky top-0 z-100">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-military-800 rounded text-khaki-300"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h2 className="text-xl font-military font-bold text-khaki-100">
            KVZ Admin Panel
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-sm">
            <p className="text-khaki-100 font-medium">
              {session.user?.fullName}
            </p>
            <p className="text-khaki-500 text-xs">{session.user?.role}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 bg-olive-700 hover:bg-olive-600 rounded-full flex items-center justify-center text-khaki-100 font-bold transition-colors"
            >
              {session.user?.username?.charAt(0).toUpperCase()}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-military-800 border border-olive-800 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-khaki-300 hover:bg-military-700 hover:text-khaki-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Odhlásit se
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
