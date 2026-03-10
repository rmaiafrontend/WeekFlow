import React from "react";
import { Plus, ChevronLeft, FolderKanban } from "lucide-react";
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
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return (
        <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-800/40">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    {onCollapse && (
                        <button
                            onClick={onCollapse}
                            className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Recolher sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        Projetos
                    </span>
                </div>
                <button
                    onClick={onAddProject}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-all"
                    title="Novo projeto"
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content */}
            <div
                className="flex-1 overflow-y-auto px-3 py-1"
                style={{ scrollbarWidth: "none" }}
            >
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <FolderKanban className="w-8 h-8 text-gray-200 dark:text-gray-700" />
                        <p className="text-xs text-gray-300 dark:text-gray-600">
                            Nenhum projeto ainda
                        </p>
                        <button
                            onClick={onAddProject}
                            className="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                            Criar primeiro projeto
                        </button>
                    </div>
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

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                {totalTasks > 0 && (
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-widest text-gray-300 dark:text-gray-600">
                            Progresso
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                            {completedTasks}/{totalTasks}
                        </span>
                    </div>
                )}
                {totalTasks > 0 && (
                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 overflow-hidden">
                        <div
                            className="h-full bg-indigo-400 dark:bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                        />
                    </div>
                )}
                <button
                    onClick={onAddTask}
                    className="w-full text-xs font-medium bg-gray-900 dark:bg-gray-800 text-white px-3 py-2.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                    + Nova Task
                </button>
            </div>
        </div>
    );
}
