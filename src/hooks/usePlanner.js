import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/tasks";
import { projectService } from "@/services/projects";
import { toISODate } from "@/lib/date-utils";
import toast from "react-hot-toast";

export function usePlanner() {
    const queryClient = useQueryClient();
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [defaultDay, setDefaultDay] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [expandedProjects, setExpandedProjects] = useState({});
    const [weekOffset, setWeekOffset] = useState(0);

    // ── Queries ──
    const { data: projects = [] } = useQuery({
        queryKey: ["projects"],
        queryFn: () => projectService.list(),
    });

    const { data: tasks = [] } = useQuery({
        queryKey: ["tasks"],
        queryFn: () => taskService.list(),
    });

    // ── Mutations (optimistic updates) ──
    const createTask = useMutation({
        mutationFn: (data) => taskService.create(data),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previous = queryClient.getQueryData(["tasks"]);
            const maxPosition = (previous || []).reduce((max, t) => Math.max(max, t.position ?? 0), -1);
            queryClient.setQueryData(["tasks"], (old = []) => [
                ...old,
                { ...data, id: `temp-${Date.now()}`, completed: false, position: maxPosition + 1, created_at: new Date().toISOString() },
            ]);
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["tasks"], ctx.previous);
            toast.error(`Erro ao criar task: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const createProject = useMutation({
        mutationFn: (data) => projectService.create(data),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ["projects"] });
            const previous = queryClient.getQueryData(["projects"]);
            queryClient.setQueryData(["projects"], (old = []) => [
                ...old,
                { ...data, id: `temp-${Date.now()}`, created_at: new Date().toISOString() },
            ]);
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["projects"], ctx.previous);
            toast.error(`Erro ao criar projeto: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });

    const updateProject = useMutation({
        mutationFn: ({ id, data }) => projectService.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["projects"] });
            const previous = queryClient.getQueryData(["projects"]);
            queryClient.setQueryData(["projects"], (old = []) =>
                old.map((p) => (p.id === id ? { ...p, ...data } : p))
            );
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["projects"], ctx.previous);
            toast.error(`Erro ao atualizar projeto: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });

    const deleteProject = useMutation({
        mutationFn: (id) => projectService.delete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["projects"] });
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousProjects = queryClient.getQueryData(["projects"]);
            const previousTasks = queryClient.getQueryData(["tasks"]);
            queryClient.setQueryData(["projects"], (old = []) =>
                old.filter((p) => p.id !== id)
            );
            queryClient.setQueryData(["tasks"], (old = []) =>
                old.filter((t) => t.project_id !== id)
            );
            return { previousProjects, previousTasks };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previousProjects) queryClient.setQueryData(["projects"], ctx.previousProjects);
            if (ctx?.previousTasks) queryClient.setQueryData(["tasks"], ctx.previousTasks);
            toast.error(`Erro ao excluir projeto: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const updateTask = useMutation({
        mutationFn: ({ id, data }) => taskService.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previous = queryClient.getQueryData(["tasks"]);
            queryClient.setQueryData(["tasks"], (old = []) =>
                old.map((t) => (t.id === id ? { ...t, ...data } : t))
            );
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["tasks"], ctx.previous);
            toast.error(`Erro ao atualizar task: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const deleteTask = useMutation({
        mutationFn: (id) => taskService.delete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previous = queryClient.getQueryData(["tasks"]);
            queryClient.setQueryData(["tasks"], (old = []) =>
                old.filter((t) => t.id !== id)
            );
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["tasks"], ctx.previous);
            toast.error(`Erro ao excluir task: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    // ── Handlers ──
    const handleToggleTask = (task) =>
        updateTask.mutate({ id: task.id, data: { completed: !task.completed } });

    const handleDeleteTask = (task) => deleteTask.mutate(task.id);

    const handleMoveDay = (task, date) => {
        updateTask.mutate({ id: task.id, data: { scheduled_date: toISODate(new Date(date)) } });
    };

    const handleUnscheduleTask = (task) => {
        updateTask.mutate({ id: task.id, data: { scheduled_date: null } });
    };

    const handleAddTask = (date) => {
        setDefaultDay(date);
        setEditingTask(null);
        setShowAddTask(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setDefaultDay(null);
        setShowAddTask(true);
    };

    const handleToggleExpand = (id) =>
        setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));

    const reorderTasks = useMutation({
        mutationFn: (updates) => taskService.reorder(updates),
        onMutate: async (updates) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previous = queryClient.getQueryData(["tasks"]);
            queryClient.setQueryData(["tasks"], (old = []) => {
                const posMap = new Map(updates.map((u) => [u.id, u.position]));
                return old.map((t) => posMap.has(t.id) ? { ...t, position: posMap.get(t.id) } : t);
            });
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["tasks"], ctx.previous);
            toast.error(`Erro ao reordenar: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        const isSameContainer = destination.droppableId === source.droppableId;
        const isSameIndex = destination.index === source.index;
        if (isSameContainer && isSameIndex) return;

        // Block drops INTO sidebar
        if (destination.droppableId.startsWith("sidebar-") && !source.droppableId.startsWith("sidebar-")) return;

        const taskId = draggableId.startsWith("sidebar-")
            ? draggableId.replace("sidebar-", "")
            : draggableId;
        const task = tasks.find((t) => t.id === taskId);
        if (!task || String(task.id).startsWith("temp-")) return;

        if (isSameContainer) {
            // Reorder within same container
            let containerTasks;
            if (source.droppableId.startsWith("sidebar-")) {
                const projectId = source.droppableId.replace("sidebar-", "");
                containerTasks = [...tasks.filter((t) => t.project_id === projectId)].sort((a, b) => a.position - b.position);
            } else {
                const dateKey = source.droppableId;
                containerTasks = [...tasks.filter((t) => t.scheduled_date && t.scheduled_date.slice(0, 10) === dateKey)].sort((a, b) => a.position - b.position);
            }

            const [moved] = containerTasks.splice(source.index, 1);
            containerTasks.splice(destination.index, 0, moved);

            const updates = containerTasks.map((t, i) => ({ id: t.id, position: i }));
            reorderTasks.mutate(updates);
        } else {
            // Move between containers (day columns, or sidebar → day)
            const newDate = destination.droppableId.startsWith("sidebar-") ? null : destination.droppableId;

            // Get tasks in destination container, sorted
            let destTasks;
            if (newDate) {
                destTasks = [...tasks.filter((t) => t.id !== task.id && t.scheduled_date && t.scheduled_date.slice(0, 10) === newDate)].sort((a, b) => a.position - b.position);
            } else {
                const projectId = destination.droppableId.replace("sidebar-", "");
                destTasks = [...tasks.filter((t) => t.id !== task.id && t.project_id === projectId && !t.scheduled_date)].sort((a, b) => a.position - b.position);
            }

            destTasks.splice(destination.index, 0, task);
            const positionUpdates = destTasks.map((t, i) => ({ id: t.id, position: i }));

            // Update moved task's date + position, then reorder the rest
            const movedPosition = positionUpdates.find((u) => u.id === task.id)?.position ?? 0;
            updateTask.mutate({ id: task.id, data: { scheduled_date: newDate, position: movedPosition } });

            const otherUpdates = positionUpdates.filter((u) => u.id !== task.id);
            if (otherUpdates.length > 0) {
                reorderTasks.mutate(otherUpdates);
            }
        }
    };

    const handleSaveTask = (data) => {
        if (editingTask) {
            updateTask.mutate({ id: editingTask.id, data });
        } else {
            const maxPosition = tasks.reduce((max, t) => Math.max(max, t.position ?? 0), -1);
            createTask.mutate({ ...data, position: maxPosition + 1 });
        }
    };

    const handleSaveProject = (data) => {
        if (editingProject) {
            updateProject.mutate({ id: editingProject.id, data });
        } else {
            createProject.mutate(data);
        }
    };

    const handleEditProject = (project) => {
        setEditingProject(project);
        setShowAddProject(true);
    };

    const handleDeleteProject = (project) => {
        deleteProject.mutate(project.id);
    };

    const handleOpenNewProject = () => {
        setEditingProject(null);
        setShowAddProject(true);
    };

    // ── Dados derivados (ordenados por position) ──
    const sortedTasks = [...tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const tasksByDate = {};
    sortedTasks.forEach((task) => {
        if (task.scheduled_date) {
            const key = task.scheduled_date.slice(0, 10);
            if (!tasksByDate[key]) tasksByDate[key] = [];
            tasksByDate[key].push(task);
        }
    });

    const unscheduledTasks = sortedTasks.filter((t) => !t.scheduled_date);

    return {
        // State
        projects,
        tasks: sortedTasks,
        tasksByDate,
        unscheduledTasks,
        weekOffset,
        setWeekOffset,
        expandedProjects,
        showAddTask,
        setShowAddTask,
        showAddProject,
        setShowAddProject,
        defaultDay,
        editingTask,
        editingProject,

        // Pending states
        isCreatingTask: createTask.isPending,
        isSavingTask: updateTask.isPending,
        isDeletingTask: deleteTask.isPending,
        isCreatingProject: createProject.isPending,
        isSavingProject: updateProject.isPending,
        isDeletingProject: deleteProject.isPending,

        // Handlers
        handleToggleTask,
        handleDeleteTask,
        handleMoveDay,
        handleUnscheduleTask,
        handleAddTask,
        handleEditTask,
        handleToggleExpand,
        handleDragEnd,
        handleSaveTask,
        handleSaveProject,
        handleEditProject,
        handleDeleteProject,
        handleOpenNewProject,
    };
}
