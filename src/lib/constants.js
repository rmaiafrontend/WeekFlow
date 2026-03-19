/**
 * Constantes compartilhadas do planner
 */

export const DOT_COLOR_MAP = {
    indigo: "bg-indigo-400",
    rose: "bg-rose-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    sky: "bg-sky-400",
    violet: "bg-violet-400",
    orange: "bg-orange-400",
    teal: "bg-teal-400",
};

export const PRIORITY_OPTIONS = [
    { value: "low", label: "Baixa", dot: "bg-sky-400", active: "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-700" },
    { value: "medium", label: "Média", dot: "bg-amber-400", active: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700" },
    { value: "high", label: "Alta", dot: "bg-rose-400", active: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-700" },
];

export const COLOR_OPTIONS = [
    { value: "indigo", label: "Indigo", bg: "bg-indigo-500" },
    { value: "rose", label: "Rosa", bg: "bg-rose-500" },
    { value: "emerald", label: "Verde", bg: "bg-emerald-500" },
    { value: "amber", label: "Âmbar", bg: "bg-amber-500" },
    { value: "sky", label: "Azul", bg: "bg-sky-500" },
    { value: "violet", label: "Violeta", bg: "bg-violet-500" },
    { value: "orange", label: "Laranja", bg: "bg-orange-500" },
    { value: "teal", label: "Teal", bg: "bg-teal-500" },
];

export const HEATMAP_COLOR_MAP = {
    indigo: "bg-indigo-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
    violet: "bg-violet-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
};
