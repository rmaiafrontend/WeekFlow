import React, { useEffect, useState } from "react";
import { LogOut, Sun, Moon } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function Layout({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
      {children}
    </div>
  );
}

export function AppHeader() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const { logout, user } = useAuth();
  const location = useLocation();

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
      <div className="px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            WeekFlow
          </span>
          <nav className="flex gap-4">
            <Link
              to="/"
              className={`text-sm pb-0.5 transition-colors ${
                location.pathname === "/"
                  ? "text-gray-900 dark:text-gray-100 border-b border-gray-900 dark:border-gray-100"
                  : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
              }`}
            >
              Planner
            </Link>
            <Link
              to="/habitos"
              className={`text-sm pb-0.5 transition-colors ${
                location.pathname === "/habitos"
                  ? "text-gray-900 dark:text-gray-100 border-b border-gray-900 dark:border-gray-100"
                  : "text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
              }`}
            >
              Hábitos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
              {user.email}
            </span>
          )}
          <button
            onClick={toggleTheme}
            className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
            aria-label="Alternar tema"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => logout()}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}