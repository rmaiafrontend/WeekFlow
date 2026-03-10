import React from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { AnimatePresence, motion } from "framer-motion";
import { Droppable } from "@hello-pangea/dnd";
import { DAY_LABELS } from "@/lib/date-utils";

export default function DayColumn({ day, date, dateKey, tasks, projects, onAddTask, onToggle, onDelete, onMoveDay, onEdit, isToday, draggable = true }) {
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p]));
  const done = tasks.filter(t => t.completed).length;

  const taskList = (droppableProps = {}, ref = null, isDraggingOver = false) => (
    <div
      ref={ref}
      {...droppableProps}
      className={`flex-1 min-h-[40px] divide-y divide-gray-50 dark:divide-gray-700/50 rounded-md transition-colors ${isDraggingOver ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
        }`}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
            <TaskCard
              task={task}
              project={projectMap[task.project_id]}
              onToggle={onToggle}
              onDelete={onDelete}
              onMoveDay={onMoveDay}
              onEdit={onEdit}
              index={draggable ? index : undefined}
              compact
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isToday ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-400"}`}>
            {DAY_LABELS[day]}
          </span>
          {date && (
            <span className={`text-xs ${isToday ? "text-indigo-500 dark:text-indigo-400 font-semibold" : "text-gray-300 dark:text-gray-500"}`}>
              {date.getDate()}
            </span>
          )}
        </div>
        {tasks.length > 0 && (
          <span className="text-xs text-gray-300 dark:text-gray-500">{done}/{tasks.length}</span>
        )}
      </div>

      {draggable ? (
        <Droppable droppableId={dateKey || day}>
          {(provided, snapshot) => (
            <div>
              {taskList(provided.droppableProps, provided.innerRef, snapshot.isDraggingOver)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        taskList()
      )}

      <button
        onClick={() => onAddTask(date || day)}
        className="mt-2 flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-300 transition-colors py-1"
      >
        <Plus className="w-3 h-3" />
        Adicionar
      </button>
    </div>
  );
}