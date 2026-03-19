import React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DOT_COLOR_MAP } from "@/lib/constants";
import HabitHeatmap from "./HabitHeatmap";
import HabitStats from "./HabitStats";

export default function HabitCard({ habit, logs, onToggle, onEdit, onDelete }) {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT_COLOR_MAP[habit.color] || "bg-emerald-400"}`} />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {habit.name}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuItem onClick={() => onEdit(habit)} className="text-xs gap-2">
              <Pencil className="w-3 h-3" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(habit)} className="text-xs gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="w-3 h-3" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Heatmap */}
      <HabitHeatmap habit={habit} logs={logs} onToggle={onToggle} />

      {/* Stats */}
      <HabitStats logs={logs} />
    </div>
  );
}
