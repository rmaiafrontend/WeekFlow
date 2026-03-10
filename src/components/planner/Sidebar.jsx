import React from "react";
import { Plus, ChevronLeft } from "lucide-react";
import ProjectTaskList from "./ProjectTaskList";

export default function Sidebar({
    projects,
    tasks,
    expandedProjects,
    onToggleTask,
    onDeleteTask,
    onMoveDay,
    onEditTask,
    onEditProject,
    onToggleExpand,
    onAddProject,
    onAddTask,
    onCollapse,
}) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    {onCollapse && (
                        <button
                            onClick={onCollapse}
                            className="text-gray-300 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
                            title="Recolher sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                        Projetos
                    </span>
                </div>
                <button
                    onClick={onAddProject}
                    className="text-gray-300 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 transition-colors"
                    title="Novo projeto"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div
                className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none"
                style={{ scrollbarWidth: "none" }}
            >
                {projects.length === 0 ? (
                    <p className="text-xs text-gray-300 dark:text-gray-600 text-center py-8">
                        Nenhum projeto ainda.
                    </p>
                ) : (
                    projects.map((project) => (
                        <ProjectTaskList
                            key={project.id}
                            project={project}
                            tasks={tasks.filter((t) => t.project_id === project.id)}
                            onToggle={onToggleTask}
                            onDelete={onDeleteTask}
                            onMoveDay={onMoveDay}
                            onEdit={onEditTask}
                            onEditProject={onEditProject}
                            expanded={expandedProjects[project.id] !== false}
                            onToggleExpand={() => onToggleExpand(project.id)}
                        />
                    ))
                )}
            </div>

            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onAddTask}
                    className="w-full text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                    + Nova Task
                </button>
            </div>
        </div>
    );
}
