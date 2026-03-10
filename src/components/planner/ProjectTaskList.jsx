import React from "react";
import { ChevronDown, ChevronRight, GripVertical, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { DOT_COLOR_MAP } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";

export default function ProjectTaskList({ project, tasks, onToggle, onDelete, onEdit, onEditProject, expanded, onToggleExpand }) {
  const dot = DOT_COLOR_MAP[project.color] || DOT_COLOR_MAP.indigo;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="mb-1">
      {/* Project header */}
      <div className="group flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-white dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
        <button
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-2.5 min-w-0"
        >
          <span className={`w-2.5 h-2.5 rounded-md flex-shrink-0 ${dot}`} />
          <span className="flex-1 text-left text-[13px] font-medium text-gray-700 dark:text-gray-200 truncate">
            {project.name}
          </span>
          <span className="text-[10px] text-gray-300 dark:text-gray-600 flex-shrink-0 tabular-nums">
            {completedCount}/{tasks.length}
          </span>
          {expanded
            ? <ChevronDown className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            : <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
          }
        </button>
        {onEditProject && (
          <button
            onClick={() => onEditProject(project)}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-300"
            title="Editar projeto"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Tasks */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <Droppable droppableId={`sidebar-${project.id}`} isDropDisabled={true}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="pb-2 ml-3 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
                  {tasks.length === 0 ? (
                    <p className="text-[11px] text-gray-300 dark:text-gray-600 py-2 pl-1">Nenhuma task</p>
                  ) : (
                    tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={`sidebar-${task.id}`} index={index}>
                        {(drag, snapshot) => (
                          <div
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            className={`group flex items-center gap-2 py-1.5 px-1 rounded-md w-full hover:bg-white dark:hover:bg-gray-800/40 transition-colors ${snapshot.isDragging ? "opacity-70 bg-white dark:bg-gray-800 shadow-sm" : ""}`}
                          >
                            <div {...drag.dragHandleProps} className="flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-3 h-3 text-gray-200 dark:text-gray-700" />
                            </div>

                            <span
                              onClick={() => onToggle(task)}
                              className={`flex-1 text-[13px] leading-snug cursor-pointer select-none ${task.completed
                                ? "line-through text-gray-300 dark:text-gray-600"
                                : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                              {task.title}
                            </span>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex-shrink-0 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <MoreHorizontal className="w-3 h-3 text-gray-400" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                {onEdit && (
                                  <DropdownMenuItem onClick={() => onEdit(task)}>
                                    <Pencil className="w-3 h-3 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => onDelete(task)} className="text-rose-500">
                                  <Trash2 className="w-3 h-3 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}