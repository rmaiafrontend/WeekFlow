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

    // ── Mutations ──
    const createTask = useMutation({
        mutationFn: (data) => taskService.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        onError: (err) => toast.error(`Erro ao criar task: ${err.message}`),
    });

    const createProject = useMutation({
        mutationFn: (data) => projectService.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
        onError: (err) => toast.error(`Erro ao criar projeto: ${err.message}`),
    });

    const updateProject = useMutation({
        mutationFn: ({ id, data }) => projectService.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
        onError: (err) => toast.error(`Erro ao atualizar projeto: ${err.message}`),
    });

    const deleteProject = useMutation({
        mutationFn: (id) => projectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (err) => toast.error(`Erro ao excluir projeto: ${err.message}`),
    });

    const updateTask = useMutation({
        mutationFn: ({ id, data }) => taskService.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        onError: (err) => toast.error(`Erro ao atualizar task: ${err.message}`),
    });

    const deleteTask = useMutation({
        mutationFn: (id) => taskService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
        onError: (err) => toast.error(`Erro ao excluir task: ${err.message}`),
    });

    // ── Handlers ──
    const handleToggleTask = (task) =>
        updateTask.mutate({ id: task.id, data: { completed: !task.completed } });

    const handleDeleteTask = (task) => deleteTask.mutate(task.id);

    const handleMoveDay = (task, date) => {
        updateTask.mutate({ id: task.id, data: { scheduled_date: toISODate(new Date(date)) } });
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

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;
        if (destination.droppableId.startsWith("sidebar-")) return;

        const taskId = draggableId.startsWith("sidebar-")
            ? draggableId.replace("sidebar-", "")
            : draggableId;
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        updateTask.mutate({ id: task.id, data: { scheduled_date: destination.droppableId } });
    };

    const handleSaveTask = (data) => {
        if (editingTask) {
            updateTask.mutate({ id: editingTask.id, data });
        } else {
            createTask.mutate(data);
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

    // ── Dados derivados ──
    const tasksByDate = {};
    tasks.forEach((task) => {
        if (task.scheduled_date) {
            const key = task.scheduled_date.slice(0, 10);
            if (!tasksByDate[key]) tasksByDate[key] = [];
            tasksByDate[key].push(task);
        }
    });

    const unscheduledTasks = tasks.filter((t) => !t.scheduled_date);

    return {
        // State
        projects,
        tasks,
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

        // Handlers
        handleToggleTask,
        handleDeleteTask,
        handleMoveDay,
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
