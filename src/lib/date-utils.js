/**
 * Utilitários de data para o planner
 */

export const DAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export const WEEKDAYS_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export const DAY_LABELS = {
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo",
};

export const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/**
 * Converte um Date para string ISO local (yyyy-mm-dd)
 */
export function toISODate(date) {
    if (!date) return "";
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Retorna um objeto { monday: Date, tuesday: Date, ... } para a semana com offset
 */
export function getWeekDates(weekOffset = 0) {
    const today = new Date();
    const dow = today.getDay();
    const mondayDelta = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayDelta + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);
    return DAYS_ORDER.reduce((acc, day, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        acc[day] = d;
        return acc;
    }, {});
}

/**
 * Formata o intervalo de datas da semana. Ex: "3 – 9 Mar 2026"
 */
export function formatWeekRange(dates) {
    const days = Object.values(dates);
    const start = days[0];
    const end = days[6];
    if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} – ${end.getDate()} ${MONTH_LABELS[end.getMonth()]} ${end.getFullYear()}`;
    }
    return `${start.getDate()} ${MONTH_LABELS[start.getMonth()]} – ${end.getDate()} ${MONTH_LABELS[end.getMonth()]} ${end.getFullYear()}`;
}

/**
 * Retorna a key do dia da semana atual (ex: "monday")
 */
export function getTodayKey() {
    return DAYS_ORDER[(new Date().getDay() + 6) % 7];
}
