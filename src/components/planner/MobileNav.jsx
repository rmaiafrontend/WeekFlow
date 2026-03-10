import React from "react";

export default function MobileNav({ mobileView, setMobileView, onAddTask }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex gap-4">
                <button
                    onClick={() => setMobileView("week")}
                    className={`text-sm pb-0.5 transition-colors ${mobileView === "week"
                        ? "text-gray-900 dark:text-gray-100 border-b border-gray-900 dark:border-gray-100"
                        : "text-gray-400 dark:text-gray-600"
                        }`}
                >
                    Semana
                </button>
                <button
                    onClick={() => setMobileView("projects")}
                    className={`text-sm pb-0.5 transition-colors ${mobileView === "projects"
                        ? "text-gray-900 dark:text-gray-100 border-b border-gray-900 dark:border-gray-100"
                        : "text-gray-400 dark:text-gray-600"
                        }`}
                >
                    Projetos
                </button>
            </div>
            <button
                onClick={onAddTask}
                className="text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-md"
            >
                + Task
            </button>
        </div>
    );
}
