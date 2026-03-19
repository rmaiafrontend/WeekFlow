import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitService, habitLogService } from "@/services/habits";
import toast from "react-hot-toast";

export function useHabits() {
    const queryClient = useQueryClient();
    const [showAddHabit, setShowAddHabit] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);

    // ── Queries ──
    const { data: habits = [] } = useQuery({
        queryKey: ["habits"],
        queryFn: () => habitService.list(),
    });

    const { data: habitLogs = [] } = useQuery({
        queryKey: ["habit_logs"],
        queryFn: () => habitLogService.list(),
    });

    // ── Mutations (optimistic updates) ──
    const createHabit = useMutation({
        mutationFn: (data) => habitService.create(data),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ["habits"] });
            const previous = queryClient.getQueryData(["habits"]);
            queryClient.setQueryData(["habits"], (old = []) => [
                ...old,
                { ...data, id: `temp-${Date.now()}`, created_at: new Date().toISOString() },
            ]);
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["habits"], ctx.previous);
            toast.error(`Erro ao criar hábito: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    const updateHabit = useMutation({
        mutationFn: ({ id, data }) => habitService.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["habits"] });
            const previous = queryClient.getQueryData(["habits"]);
            queryClient.setQueryData(["habits"], (old = []) =>
                old.map((h) => (h.id === id ? { ...h, ...data } : h))
            );
            return { previous };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["habits"], ctx.previous);
            toast.error(`Erro ao atualizar hábito: ${err.message}`);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
    });

    const deleteHabit = useMutation({
        mutationFn: (id) => habitService.delete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["habits"] });
            await queryClient.cancelQueries({ queryKey: ["habit_logs"] });
            const previousHabits = queryClient.getQueryData(["habits"]);
            const previousLogs = queryClient.getQueryData(["habit_logs"]);
            queryClient.setQueryData(["habits"], (old = []) => old.filter((h) => h.id !== id));
            queryClient.setQueryData(["habit_logs"], (old = []) => old.filter((l) => l.habit_id !== id));
            return { previousHabits, previousLogs };
        },
        onError: (err, _vars, ctx) => {
            if (ctx?.previousHabits) queryClient.setQueryData(["habits"], ctx.previousHabits);
            if (ctx?.previousLogs) queryClient.setQueryData(["habit_logs"], ctx.previousLogs);
            toast.error(`Erro ao excluir hábito: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["habits"] });
            queryClient.invalidateQueries({ queryKey: ["habit_logs"] });
        },
    });

    // ── Debounced batch toggle ──
    const pendingAdds = useRef(new Map());   // key "habitId:date" → { habitId, date }
    const pendingRemoves = useRef(new Map());
    const flushTimer = useRef(null);

    const flushLogs = useCallback(async () => {
        const adds = [...pendingAdds.current.values()];
        const removes = [...pendingRemoves.current.values()];
        pendingAdds.current.clear();
        pendingRemoves.current.clear();

        try {
            const promises = [];
            if (adds.length > 0) promises.push(habitLogService.addBatch(adds));
            if (removes.length > 0) promises.push(habitLogService.removeBatch(removes));
            await Promise.all(promises);
        } catch (err) {
            toast.error(`Erro ao sincronizar hábitos: ${err.message}`);
        }
        queryClient.invalidateQueries({ queryKey: ["habit_logs"] });
    }, [queryClient]);

    const scheduleFlush = useCallback(() => {
        if (flushTimer.current) clearTimeout(flushTimer.current);
        flushTimer.current = setTimeout(flushLogs, 500);
    }, [flushLogs]);

    // ── Derived data ──
    const logSet = new Set(habitLogs.map((l) => `${l.habit_id}:${l.date}`));

    const isLogged = (habitId, date) => logSet.has(`${habitId}:${date}`);

    const getLogsForHabit = (habitId) => habitLogs.filter((l) => l.habit_id === habitId);

    // ── Handlers ──
    const handleSaveHabit = (data) => {
        if (editingHabit) {
            updateHabit.mutate({ id: editingHabit.id, data });
        } else {
            createHabit.mutate(data);
        }
    };

    const handleEditHabit = (habit) => {
        setEditingHabit(habit);
        setShowAddHabit(true);
    };

    const handleDeleteHabit = (habit) => {
        deleteHabit.mutate(habit.id);
    };

    const handleOpenNewHabit = () => {
        setEditingHabit(null);
        setShowAddHabit(true);
    };

    const handleToggleLog = (habitId, date) => {
        const key = `${habitId}:${date}`;
        const currentLogs = queryClient.getQueryData(["habit_logs"]) || [];
        const exists = currentLogs.some((l) => l.habit_id === habitId && l.date === date);

        // Optimistic update no cache
        if (exists) {
            queryClient.setQueryData(["habit_logs"], (old = []) =>
                old.filter((l) => !(l.habit_id === habitId && l.date === date))
            );
            // Se estava pendente para add, cancela; senão agenda remove
            if (pendingAdds.current.has(key)) {
                pendingAdds.current.delete(key);
            } else {
                pendingRemoves.current.set(key, { habitId, date });
            }
        } else {
            queryClient.setQueryData(["habit_logs"], (old = []) => [
                ...old,
                { id: `temp-${Date.now()}`, habit_id: habitId, date, created_at: new Date().toISOString() },
            ]);
            // Se estava pendente para remove, cancela; senão agenda add
            if (pendingRemoves.current.has(key)) {
                pendingRemoves.current.delete(key);
            } else {
                pendingAdds.current.set(key, { habitId, date });
            }
        }

        scheduleFlush();
    };

    return {
        habits,
        habitLogs,
        showAddHabit,
        setShowAddHabit,
        editingHabit,
        isLogged,
        getLogsForHabit,
        handleSaveHabit,
        handleEditHabit,
        handleDeleteHabit,
        handleOpenNewHabit,
        handleToggleLog,
        isPending: createHabit.isPending || updateHabit.isPending || deleteHabit.isPending,
    };
}
