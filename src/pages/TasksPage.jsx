import React, { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Plus,
  MoreHorizontal,
  Trash2,
  Calendar,
  CalendarOff,
  FolderKanban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanner } from "@/hooks/usePlanner";
import { AppHeader } from "@/Layout";
import { DOT_COLOR_MAP, PRIORITY_OPTIONS } from "@/lib/constants";
import { MONTH_LABELS } from "@/lib/date-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTaskDialog from "../components/planner/AddTaskDialog";
import AddProjectDialog from "../components/planner/AddProjectDialog";

const STATUS_FILTERS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

function formatScheduled(iso) {
  if (!iso) return null;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return `${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`;
}

function priorityMeta(value) {
  return PRIORITY_OPTIONS.find((p) => p.value === value);
}

function TaskRow({ task, index, draggable, onToggle, onEdit, onDelete, onUnschedule }) {
  const scheduled = formatScheduled(task.scheduled_date);
  const prio = priorityMeta(task.priority);

  return (
    <Draggable draggableId={`sidebar-${task.id}`} index={index} isDragDisabled={!draggable}>
      {(drag, snapshot) => (
        <div
          ref={drag.innerRef}
          {...drag.draggableProps}
          className={`group flex items-center gap-3 py-2 px-2 rounded-md transition-colors ${
            snapshot.isDragging
              ? "bg-white dark:bg-gray-800 shadow-sm opacity-80"
              : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
          }`}
        >
          {draggable ? (
            <div
              {...drag.dragHandleProps}
              className="flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
            </div>
          ) : (
            <div className="w-3.5 flex-shrink-0" />
          )}

          <button
            onClick={() => onToggle(task)}
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors ${
              task.completed
                ? "bg-indigo-400 border-indigo-400 dark:bg-indigo-500 dark:border-indigo-500"
                : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500"
            }`}
            aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
          />

          <span
            onClick={() => onToggle(task)}
            className={`flex-1 min-w-0 text-sm cursor-pointer select-none break-words ${
              task.completed
                ? "line-through text-gray-300 dark:text-gray-600"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {task.title}
          </span>

          {prio && task.priority && task.priority !== "medium" && (
            <span
              className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${prio.active}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
              {prio.label}
            </span>
          )}

          {scheduled && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              {scheduled}
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-shrink-0 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="w-3 h-3 mr-2" />
                Editar
              </DropdownMenuItem>
              {task.scheduled_date && (
                <DropdownMenuItem onClick={() => onUnschedule(task)}>
                  <CalendarOff className="w-3 h-3 mr-2" />
                  Desagendar
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
  );
}

function ProjectSection({
  project,
  tasks,
  expanded,
  draggable,
  onToggleExpand,
  onEditProject,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onUnschedule,
}) {
  const dot = DOT_COLOR_MAP[project.color] || DOT_COLOR_MAP.indigo;
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <section className="border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/40 overflow-hidden">
      <header className="group px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <span className={`w-2.5 h-2.5 rounded-md flex-shrink-0 ${dot}`} />
            <h2 className="flex-1 min-w-0 text-left text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {project.name}
            </h2>
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
            )}
          </button>

          <button
            onClick={() => onEditProject(project)}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-300"
            title="Editar projeto"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
            {completed}/{total}
          </span>
          <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 dark:bg-indigo-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            onClick={() => onAddTask(project.id)}
            className="flex-shrink-0 text-[11px] text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-0.5"
            title="Adicionar task neste projeto"
          >
            <Plus className="w-3 h-3" />
            Task
          </button>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <Droppable droppableId={`sidebar-${project.id}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`px-2 py-2 transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-indigo-50/40 dark:bg-indigo-900/10"
                      : ""
                  }`}
                >
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-300 dark:text-gray-600 px-3 py-3">
                      Nenhuma task
                    </p>
                  ) : (
                    tasks.map((task, index) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        index={index}
                        draggable={draggable}
                        onToggle={onToggleTask}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        onUnschedule={onUnschedule}
                      />
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function TasksPage() {
  const planner = usePlanner();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") return planner.tasks;
    if (statusFilter === "completed") return planner.tasks.filter((t) => t.completed);
    return planner.tasks.filter((t) => !t.completed);
  }, [planner.tasks, statusFilter]);

  const totals = useMemo(() => {
    const all = planner.tasks.length;
    const completed = planner.tasks.filter((t) => t.completed).length;
    return { all, completed, pending: all - completed };
  }, [planner.tasks]);

  return (
    <div className="bg-white dark:bg-gray-900 h-screen overflow-hidden flex flex-col">
      <AppHeader />

      <DragDropContext onDragEnd={planner.handleDragEnd}>
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  Tarefas
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {totals.pending} pendentes · {totals.completed} concluídas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={planner.handleOpenNewProject}
                  className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Novo projeto
                </button>
                <button
                  onClick={() => planner.handleAddTask(null)}
                  className="text-xs font-medium px-3 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  + Nova task
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 mb-6">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    statusFilter === f.value
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Projects list */}
            {planner.projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <FolderKanban className="w-10 h-10 text-gray-200 dark:text-gray-700" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Nenhum projeto ainda
                </p>
                <button
                  onClick={planner.handleOpenNewProject}
                  className="text-sm text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Criar primeiro projeto
                </button>
              </div>
            ) : (
              <div className="md:overflow-x-auto md:-mx-8 md:px-8 no-scrollbar">
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                  {planner.projects.map((project) => {
                    const projectTasks = filteredTasks.filter(
                      (t) => t.project_id === project.id
                    );
                    const expanded = planner.expandedProjects[project.id] !== false;
                    return (
                      <div
                        key={project.id}
                        className="md:flex-shrink-0 md:w-[320px]"
                      >
                        <ProjectSection
                          project={project}
                          tasks={projectTasks}
                          expanded={expanded}
                          draggable={statusFilter === "all"}
                          onToggleExpand={() => planner.handleToggleExpand(project.id)}
                          onEditProject={planner.handleEditProject}
                          onAddTask={() => planner.handleAddTask(null)}
                          onToggleTask={planner.handleToggleTask}
                          onEditTask={planner.handleEditTask}
                          onDeleteTask={planner.handleDeleteTask}
                          onUnschedule={planner.handleUnscheduleTask}
                        />
                      </div>
                    );
                  })}
                  <div aria-hidden className="hidden md:block md:w-8 md:flex-shrink-0" />
                </div>
              </div>
            )}
          </div>
        </main>
      </DragDropContext>

      <AddTaskDialog
        open={planner.showAddTask}
        onOpenChange={planner.setShowAddTask}
        projects={planner.projects}
        onSave={planner.handleSaveTask}
        defaultDate={planner.defaultDay}
        editingTask={planner.editingTask}
        isPending={planner.isCreatingTask || planner.isSavingTask}
      />
      <AddProjectDialog
        open={planner.showAddProject}
        onOpenChange={planner.setShowAddProject}
        onSave={planner.handleSaveProject}
        onDelete={planner.handleDeleteProject}
        editingProject={planner.editingProject}
        isPending={
          planner.isCreatingProject ||
          planner.isSavingProject ||
          planner.isDeletingProject
        }
      />
    </div>
  );
}
