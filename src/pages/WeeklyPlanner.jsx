import React, { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { DragDropContext } from "@hello-pangea/dnd";
import { usePlanner } from "@/hooks/usePlanner";
import { DAYS_ORDER, WEEKDAYS_ORDER, getWeekDates, toISODate, getTodayKey } from "@/lib/date-utils";
import { AppHeader } from "@/Layout";
import WeekNavigation from "../components/planner/WeekNavigation";
import Sidebar from "../components/planner/Sidebar";
import MobileNav from "../components/planner/MobileNav";
import DayColumn from "../components/planner/DayColumn";
import AddTaskDialog from "../components/planner/AddTaskDialog";
import AddProjectDialog from "../components/planner/AddProjectDialog";

export default function WeeklyPlanner() {
  const isResizing = useRef(false);

  const planner = usePlanner();
  const weekDates = getWeekDates(planner.weekOffset);
  const today = getTodayKey();
  const [mobileView, setMobileView] = useState("week");
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [showWeekend, setShowWeekend] = useState(() => localStorage.getItem("showWeekend") !== "false");

  const toggleWeekend = () => {
    setShowWeekend((prev) => {
      const next = !prev;
      localStorage.setItem("showWeekend", String(next));
      return next;
    });
  };

  const visibleDays = showWeekend ? DAYS_ORDER : WEEKDAYS_ORDER;

  // ── Resize handle ──
  const handleResizeMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (e) => {
      if (!isResizing.current) return;
      setSidebarWidth(Math.min(480, Math.max(160, e.clientX)));
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // ── Shared sidebar props ──
  const sidebarProps = {
    projects: planner.projects,
    tasks: planner.tasks,
    expandedProjects: planner.expandedProjects,
    onToggleTask: planner.handleToggleTask,
    onDeleteTask: planner.handleDeleteTask,
    onMoveDay: planner.handleMoveDay,
    onEditTask: planner.handleEditTask,
    onEditProject: planner.handleEditProject,
    onToggleExpand: planner.handleToggleExpand,
    onAddProject: planner.handleOpenNewProject,
    onAddTask: () => planner.handleAddTask(null),
  };

  // ── Week Panel (shared between desktop & mobile) ──
  const weekPanel = (draggable = true) => (
    <div className="px-4 md:px-8 py-6">
      <WeekNavigation
        weekDates={weekDates}
        weekOffset={planner.weekOffset}
        setWeekOffset={planner.setWeekOffset}
        showWeekend={showWeekend}
        onToggleWeekend={toggleWeekend}
      />

      <div className="md:overflow-x-auto md:-mx-8 md:px-8" style={{ scrollbarWidth: "thin" }}>
        <div className="flex flex-col md:flex-row md:min-w-[900px] divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700/60">
          {visibleDays.map((day) => {
            const date = weekDates[day];
            const dateKey = toISODate(date);
            return (
              <div key={day} className="py-4 md:py-0 md:flex-1 md:min-w-[220px] md:px-3 md:first:pl-0 md:last:pr-0">
                <DayColumn
                  day={day}
                  date={date}
                  dateKey={dateKey}
                  tasks={planner.tasksByDate[dateKey] || []}
                  projects={planner.projects}
                  onAddTask={planner.handleAddTask}
                  onToggle={planner.handleToggleTask}
                  onDelete={planner.handleDeleteTask}
                  onMoveDay={planner.handleMoveDay}
                  onEdit={planner.handleEditTask}
                  isToday={planner.weekOffset === 0 && day === today}
                  draggable={draggable}
                />
              </div>
            );
          })}
        </div>
      </div>

      {planner.unscheduledTasks.length > 0 && (
        <div className="mt-10 md:hidden">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-300 dark:text-gray-500 mb-3">
            Sem dia definido
          </p>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {planner.unscheduledTasks.map((task) => {
              const project = planner.projects.find((p) => p.id === task.project_id);
              return (
                <div key={task.id} className="flex items-center gap-2.5 py-2">
                  <span
                    onClick={() => planner.handleToggleTask(task)}
                    className={`text-sm flex-1 cursor-pointer select-none ${task.completed
                      ? "line-through text-gray-300 dark:text-gray-600"
                      : "text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {task.title}
                  </span>
                  {project && (
                    <span className="text-xs text-gray-300 dark:text-gray-600 flex-shrink-0">
                      {project.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 h-screen overflow-hidden">
      <DragDropContext onDragEnd={planner.handleDragEnd}>
        {/* ── DESKTOP (md+) ── */}
        <div className="hidden md:flex h-full overflow-hidden">
          {sidebarCollapsed ? (
            <aside className="flex-shrink-0 border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col items-center py-4 w-12">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
                title="Expandir sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </aside>
          ) : (
            <aside
              style={{ width: sidebarWidth }}
              className="flex-shrink-0 border-r border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden relative bg-white dark:bg-gray-900"
            >
              <Sidebar {...sidebarProps} onCollapse={() => setSidebarCollapsed(true)} />
              <div
                onMouseDown={handleResizeMouseDown}
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-400 transition-colors opacity-0 hover:opacity-100"
              />
            </aside>
          )}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto">{weekPanel(true)}</main>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden flex flex-col h-full">
          <AppHeader />
          <MobileNav
            mobileView={mobileView}
            setMobileView={setMobileView}
            onAddTask={() => planner.handleAddTask(null)}
          />
          <div className="flex-1 overflow-y-auto">
            {mobileView === "week" ? weekPanel(false) : <Sidebar {...sidebarProps} />}
          </div>
        </div>

        {/* ── Dialogs ── */}
        <AddTaskDialog
          open={planner.showAddTask}
          onOpenChange={planner.setShowAddTask}
          projects={planner.projects}
          onSave={planner.handleSaveTask}
          defaultDate={planner.defaultDay}
          editingTask={planner.editingTask}
        />
        <AddProjectDialog
          open={planner.showAddProject}
          onOpenChange={planner.setShowAddProject}
          onSave={planner.handleSaveProject}
          onDelete={planner.handleDeleteProject}
          editingProject={planner.editingProject}
        />
      </DragDropContext>
    </div>
  );
}