import React from "react";
import { MoreHorizontal, Trash2, GripVertical, Pencil, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProjectBadge from "./ProjectBadge";
import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, project, onToggle, onDelete, onMoveDay, onUnschedule, onEdit, compact = false, index }) {
  // If index is undefined (e.g. from ProjectTaskList), render without drag
  const isDraggable = index !== undefined;

  const content = (dragHandleProps, isDragging) => (
    <div className={`group flex items-start gap-2.5 py-2 px-0 ${isDragging ? "opacity-70" : ""} hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors`}>
      {isDraggable && (
        <div {...dragHandleProps} className="mt-1 flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-gray-300" />
        </div>
      )}



      <div className="flex-1 min-w-0">
        <p onClick={() => onToggle(task)} className={`text-sm leading-snug cursor-pointer select-none ${task.completed ? "line-through text-gray-300 dark:text-gray-500" : "text-gray-700 dark:text-gray-200"}`}>
          {task.title}
        </p>
        {!compact && project && (
          <div className="mt-0.5">
            <ProjectBadge project={project} />
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 p-1">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(task)} className="text-xs gap-2 py-1.5">
              <Pencil className="w-3 h-3" strokeWidth={1.5} />
              Editar
            </DropdownMenuItem>
          )}
          {onUnschedule && task.scheduled_date && (
            <DropdownMenuItem onClick={() => onUnschedule(task)} className="text-xs gap-2 py-1.5">
              <CalendarOff className="w-3 h-3" strokeWidth={1.5} />
              Remover do dia
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onDelete(task)} className="text-xs gap-2 py-1.5 text-rose-500 focus:text-rose-500">
            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (!isDraggable) {
    return content(null, false);
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {content(provided.dragHandleProps, snapshot.isDragging)}
        </div>
      )}
    </Draggable>
  );
}