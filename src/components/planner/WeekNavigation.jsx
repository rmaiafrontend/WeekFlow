import React from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { formatWeekRange } from "@/lib/date-utils";

export default function WeekNavigation({ weekDates, weekOffset, setWeekOffset, showWeekend, onToggleWeekend }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <button
                onClick={() => setWeekOffset((w) => w - 1)}
                className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[160px] text-center">
                {formatWeekRange(weekDates)}
            </span>
            <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
            {weekOffset !== 0 && (
                <button
                    onClick={() => setWeekOffset(0)}
                    className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                    Hoje
                </button>
            )}

            <div className="flex-1" />

            <button
                onClick={onToggleWeekend}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${showWeekend
                    ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                title={showWeekend ? "Ocultar fim de semana" : "Exibir fim de semana"}
            >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{showWeekend ? "Sem – Dom" : "Seg – Sex"}</span>
            </button>
        </div>
    );
}
