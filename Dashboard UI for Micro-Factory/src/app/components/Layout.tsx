import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Gamepad2,
  ScrollText,
  Settings,
  Factory,
} from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/app", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/app/control", icon: Gamepad2, label: "Contrôle" },
    { path: "/app/logs", icon: ScrollText, label: "Logs" },
    { path: "/app/settings", icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Factory className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="font-bold text-lg">Micro-Usine</h1>
              <p className="text-xs text-slate-400">
                Système de pilotage
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

const isActive =
  item.path === "/app"
    ? location.pathname === "/app"
    : location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>API Connectée</span>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}