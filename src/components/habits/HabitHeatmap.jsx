import React from "react";
import { HEATMAP_COLOR_MAP } from "@/lib/constants";
import { MONTH_LABELS } from "@/lib/date-utils";

function toISO(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HabitHeatmap({ habit, logs, onToggle }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start 364 days ago (365 days including today)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  // Align to previous Monday
  const dayOfWeek = startDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + mondayOffset);

  // Build Set of logged dates for O(1) lookup
  const loggedDates = new Set(logs.map((l) => l.date.slice(0, 10)));

  // Generate weeks (columns) with 7 days each (rows)
  const weeks = [];
  const current = new Date(startDate);
  let currentWeek = [];

  while (current <= today || currentWeek.length > 0) {
    const dateStr = toISO(current);
    const isFuture = current > today;
    const isPast = current < startDate;

    if (!isFuture || currentWeek.length > 0) {
      currentWeek.push({
        date: dateStr,
        isLogged: loggedDates.has(dateStr),
        isFuture,
        isPast,
      });
    }

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
      if (isFuture) break;
    }

    current.setDate(current.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    // Pad remaining days as future
    while (currentWeek.length < 7) {
      current.setDate(current.getDate() + 1);
      currentWeek.push({
        date: toISO(current),
        isLogged: false,
        isFuture: true,
        isPast: false,
      });
    }
    weeks.push(currentWeek);
  }

  // Build month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    // Use the first day of the week to determine month
    const firstDay = new Date(week[0].date + "T00:00:00");
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTH_LABELS[month], weekIndex: wi });
      lastMonth = month;
    }
  });

  const filledColor = HEATMAP_COLOR_MAP[habit.color] || "bg-emerald-500";

  return (
    <div className="relative">
      <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: 24 }}>
          {monthLabels.map((m, i) => {
            const nextIndex = i + 1 < monthLabels.length ? monthLabels[i + 1].weekIndex : weeks.length;
            const span = nextIndex - m.weekIndex;
            return (
              <span
                key={`${m.label}-${m.weekIndex}`}
                className="text-[9px] text-gray-400 dark:text-gray-600"
                style={{ width: span * 14, flexShrink: 0 }}
              >
                {m.label}
              </span>
            );
          })}
        </div>

        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-0.5 flex-shrink-0">
            {["", "Seg", "", "Qua", "", "Sex", ""].map((label, i) => (
              <span
                key={i}
                className="text-[9px] text-gray-400 dark:text-gray-600 leading-none flex items-center"
                style={{ height: 11, width: 20 }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <button
                  key={day.date}
                  onClick={() => !day.isFuture && onToggle(habit.id, day.date)}
                  disabled={day.isFuture}
                  className={`rounded-sm transition-colors ${
                    day.isFuture
                      ? "bg-transparent cursor-default"
                      : day.isLogged
                        ? `${filledColor} cursor-pointer hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-500`
                        : "bg-gray-100 dark:bg-gray-800 cursor-pointer hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-500"
                  }`}
                  style={{ width: 11, height: 11 }}
                  title={day.isFuture ? "" : `${day.date}${day.isLogged ? " ✓" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Fade gradient right */}
      <div className="absolute -right-px top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
    </div>
  );
}
