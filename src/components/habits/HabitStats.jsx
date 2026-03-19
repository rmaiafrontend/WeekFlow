import React from "react";

export default function HabitStats({ logs }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonth = logs.filter((l) => {
    const d = new Date(l.date + "T00:00:00");
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const thisYear = logs.filter((l) => {
    const d = new Date(l.date + "T00:00:00");
    return d.getFullYear() === currentYear;
  }).length;

  // Current streak
  const sortedDates = [...new Set(logs.map((l) => l.date.slice(0, 10)))]
    .sort()
    .reverse();

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(today);

  const toISO = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // If today isn't logged, start checking from yesterday
  if (!sortedDates.includes(toISO(checkDate))) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (const dateStr of sortedDates) {
    if (dateStr === toISO(checkDate)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dateStr < toISO(checkDate)) {
      break;
    }
  }

  return (
    <div className="flex gap-6 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
      <div>
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{thisMonth}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1 uppercase tracking-wider">este mês</span>
      </div>
      <div>
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{thisYear}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1 uppercase tracking-wider">este ano</span>
      </div>
      <div>
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{streak}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1 uppercase tracking-wider">sequência</span>
      </div>
    </div>
  );
}
