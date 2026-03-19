import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Repeat, Palette, Trash2 } from "lucide-react";
import { COLOR_OPTIONS } from "@/lib/constants";

const emptyForm = { name: "", color: "emerald" };

export default function AddHabitDialog({ open, onOpenChange, onSave, onDelete, editingHabit, isPending }) {
  const isEditing = !!editingHabit;
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setForm({
          name: editingHabit.name || "",
          color: editingHabit.color || "emerald",
        });
      } else {
        setForm(emptyForm);
      }
      setConfirmDelete(false);
    }
  }, [open, editingHabit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || isPending) return;
    onSave(form);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (isPending) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(editingHabit);
    onOpenChange(false);
  };

  const canSubmit = form.name.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] w-[calc(100%-2rem)] sm:w-full bg-white dark:bg-gray-900">
        <VisuallyHidden.Root>
          <DialogTitle>{isEditing ? "Editar Hábito" : "Novo Hábito"}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Repeat className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {isEditing ? "Editar hábito" : "Novo hábito"}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {isEditing ? "Atualize os detalhes do hábito" : "Crie um hábito para acompanhar diariamente"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 pb-5 space-y-4">
            {/* Nome */}
            <div>
              <textarea
                rows={1}
                placeholder="Nome do hábito"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
                className="w-full resize-none bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none border border-gray-100 dark:border-gray-700/50 focus:border-emerald-300 dark:focus:border-emerald-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all leading-snug"
              />
            </div>

            {/* Cor */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <Palette className="w-3 h-3" />
                Cor
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setForm({ ...form, color: color.value })}
                    className={`w-8 h-8 rounded-xl transition-all duration-200 ${color.bg} ${form.color === color.value
                      ? "ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-gray-400 dark:ring-gray-500 scale-110"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all ${confirmDelete
                    ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30"
                    : "text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    }`}
                >
                  <Trash2 className="w-3 h-3" />
                  {confirmDelete ? "Confirmar exclusão?" : "Excluir"}
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isPending}
                className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${canSubmit && !isPending
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-500 dark:to-emerald-400 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 hover:from-emerald-700 hover:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-500 active:scale-[0.98]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  }`}
              >
                {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar hábito"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
