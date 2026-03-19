import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DAYS_ORDER, getWeekDates, formatWeekRange } from "@/lib/date-utils";
import { DOT_COLOR_MAP } from "@/lib/constants";

function toISO(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const SHORT_DAY = {
  monday: "S",
  tuesday: "T",
  wednesday: "Q",
  thursday: "Q",
  friday: "S",
  saturday: "S",
  sunday: "D",
};

const FULL_DAY = {
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
  sunday: "Dom",
};

function HabitName({ habit }) {
  const scrollRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [habit.name]);

  return (
    <div className="relative flex items-center gap-1.5 min-w-0 px-2 md:px-3 py-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLOR_MAP[habit.color] || "bg-emerald-400"}`} />
      <div className="relative min-w-0 flex-1">
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap text-xs md:text-sm text-gray-700 dark:text-gray-300 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {habit.name}
        </div>
        {isOverflowing && (
          <div className="absolute -right-px top-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
        )}
      </div>
    </div>
  );
}

export default function HabitWeekTracker({ habits, isLogged, onToggle }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDates = getWeekDates(weekOffset);
  const today = toISO(new Date());

  // 35% name + 65% days. 35 + 7×9.28 ≈ 100
  const gridCols = "35fr repeat(7, 9.3fr)";

  return (
    <div className="mb-8">
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Week navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[120px] text-center">
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
      </div>

      {/* Tracker grid */}
      <div className="habit-tracker border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        {/* Header row */}
        <div
          className="grid border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div className="px-2 md:px-3 py-2 flex items-end">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-600 font-semibold">Hábito</span>
          </div>
          {DAYS_ORDER.map((day) => {
            const date = weekDates[day];
            const dateStr = toISO(date);
            const isToday = dateStr === today;
            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center py-2 text-center ${
                  isToday ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                }`}
              >
                <span className={`text-[10px] uppercase tracking-wider ${
                  isToday
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-400 dark:text-gray-600"
                }`}>
                  <span className="md:hidden">{SHORT_DAY[day]}</span>
                  <span className="hidden md:inline">{FULL_DAY[day]}</span>
                </span>
                <span className={`text-xs font-medium ${
                  isToday
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Habit rows */}
        {habits.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-gray-300 dark:text-gray-600">
            Cadastre um hábito para começar
          </div>
        ) : (
          habits.map((habit, hi) => (
            <div
              key={habit.id}
              className={`grid items-center ${
                hi < habits.length - 1 ? "border-b border-gray-50 dark:border-gray-800/60" : ""
              }`}
              style={{ gridTemplateColumns: gridCols }}
            >
              <HabitName habit={habit} />

              {/* Day cells */}
              {DAYS_ORDER.map((day) => {
                const date = weekDates[day];
                const dateStr = toISO(date);
                const isToday = dateStr === today;
                const logged = isLogged(habit.id, dateStr);

                return (
                  <div
                    key={day}
                    className={`flex items-center justify-center py-2 ${
                      isToday ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""
                    }`}
                  >
                    <button
                      onClick={() => onToggle(habit.id, dateStr)}
                      className={`w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center transition-all duration-150 ${
                        logged
                          ? `${DOT_COLOR_MAP[habit.color] || "bg-emerald-400"} text-white shadow-sm`
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-transparent hover:text-gray-300 dark:hover:text-gray-600"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
