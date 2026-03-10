import React from "react";
import { ChevronDown, ChevronRight, GripVertical, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { DOT_COLOR_MAP } from "@/lib/constants";

export default function ProjectTaskList({ project, tasks, onToggle, onDelete, onMoveDay, onEdit, onEditProject, expanded, onToggleExpand }) {
  const dot = DOT_COLOR_MAP[project.color] || DOT_COLOR_MAP.indigo;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="border-b border-gray-100 dark:border-gray-700/60 last:border-b-0">
      <div className="group flex items-center gap-3 py-4">
        <button
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
          <span className="flex-1 text-left text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{project.name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-400 flex-shrink-0">{completedCount}/{tasks.length}</span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          }
        </button>
        {onEditProject && (
          <button
            onClick={() => onEditProject(project)}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-300"
            title="Editar projeto"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

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
                <div ref={provided.innerRef} {...provided.droppableProps} className="pb-3 pl-5 divide-y divide-gray-50 dark:divide-gray-700/50">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-300 dark:text-gray-500 py-3">Nenhuma task</p>
                  ) : (
                    tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={`sidebar-${task.id}`} index={index}>
                        {(drag, snapshot) => (
                          <div ref={drag.innerRef} {...drag.draggableProps} className={`group flex items-center gap-2 py-2 w-full ${snapshot.isDragging ? "opacity-70" : ""}`}>
                            <div {...drag.dragHandleProps} className="flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-3 h-3 text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <TaskCard
                                task={task}
                                project={project}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onMoveDay={onMoveDay}
                                onEdit={onEdit}
                              />
                            </div>
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