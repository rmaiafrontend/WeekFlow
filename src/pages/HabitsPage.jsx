import React from "react";
import { Repeat } from "lucide-react";
import { AppHeader } from "@/Layout";
import { useHabits } from "@/hooks/useHabits";
import HabitWeekTracker from "@/components/habits/HabitWeekTracker";
import HabitCard from "@/components/habits/HabitCard";
import AddHabitDialog from "@/components/habits/AddHabitDialog";

export default function HabitsPage() {
  const {
    habits,
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
    isPending,
  } = useHabits();

  return (
    <div className="bg-white dark:bg-gray-900 h-screen overflow-hidden flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Hábitos
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Acompanhe seus hábitos diários
              </p>
            </div>
            <button
              onClick={handleOpenNewHabit}
              className="text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              + Novo Hábito
            </button>
          </div>

          {/* Week tracker */}
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 mb-4">
                <Repeat className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
                Nenhum hábito cadastrado
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-600">
                Crie seu primeiro hábito para começar a acompanhar
              </p>
            </div>
          ) : (
            <>
              <HabitWeekTracker
                habits={habits}
                isLogged={isLogged}
                onToggle={handleToggleLog}
              />

              {/* Habit cards with heatmaps */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                  Histórico
                </h2>
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    logs={getLogsForHabit(habit.id)}
                    onToggle={handleToggleLog}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <AddHabitDialog
        open={showAddHabit}
        onOpenChange={setShowAddHabit}
        onSave={handleSaveHabit}
        onDelete={handleDeleteHabit}
        editingHabit={editingHabit}
        isPending={isPending}
      />
    </div>
  );
}
