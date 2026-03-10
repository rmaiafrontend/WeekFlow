import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Flag, FolderOpen, FileText, Sparkles } from "lucide-react";
import ProjectBadge from "./ProjectBadge";
import { PRIORITY_OPTIONS } from "@/lib/constants";
import { toISODate } from "@/lib/date-utils";

const emptyForm = (defaultDate) => ({
  title: "",
  project_id: "",
  scheduled_date: defaultDate ? toISODate(defaultDate) : "",
  priority: "medium",
  notes: "",
});

export default function AddTaskDialog({ open, onOpenChange, projects, onSave, defaultDate, editingTask }) {
  const isEditing = !!editingTask;
  const [form, setForm] = useState(emptyForm(defaultDate));
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setForm({
          title: editingTask.title || "",
          project_id: editingTask.project_id || "",
          scheduled_date: editingTask.scheduled_date ? editingTask.scheduled_date.slice(0, 10) : "",
          priority: editingTask.priority || "medium",
          notes: editingTask.notes || "",
        });
        setShowNotes(!!editingTask.notes);
      } else {
        setForm(emptyForm(defaultDate));
        setShowNotes(false);
      }
    }
  }, [open, editingTask, defaultDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.project_id) return;
    onSave({ ...form, scheduled_date: form.scheduled_date || null });
    onOpenChange(false);
  };

  const canSubmit = form.title.trim() && form.project_id;
  const selectedProject = projects.find((p) => p.id === form.project_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] w-[calc(100%-2rem)] sm:w-full bg-white dark:bg-gray-900">
        <VisuallyHidden.Root>
          <DialogTitle>{isEditing ? "Editar task" : "Nova task"}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {isEditing ? "Editar task" : "Nova task"}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {isEditing ? "Atualize os detalhes da sua task" : "Adicione algo ao seu planejamento"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 pb-5 space-y-4">

            {/* Título — campo principal */}
            <div className="relative">
              <textarea
                rows={1}
                placeholder="O que precisa ser feito?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                autoFocus
                className="w-full resize-none bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none border border-gray-100 dark:border-gray-700/50 focus:border-indigo-300 dark:focus:border-indigo-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all leading-snug"
              />
            </div>

            {/* Projeto — com ícone */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                <FolderOpen className="w-3 h-3" />
                Projeto
              </label>
              <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                <SelectTrigger className="h-10 text-sm border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60 rounded-xl focus:ring-0 focus:border-indigo-300 dark:focus:border-indigo-500/40 transition-colors">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="rounded-lg">
                      <ProjectBadge project={project} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data + Prioridade — Grid compacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Data
                </label>
                <input
                  type="date"
                  value={form.scheduled_date}
                  onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                  className="w-full h-10 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/60 px-3 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-indigo-300 dark:focus:border-indigo-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <Flag className="w-3 h-3" />
                  Prioridade
                </label>
                <div className="flex gap-1.5">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl border font-medium transition-all duration-200 ${form.priority === p.value
                        ? `${p.active} shadow-sm`
                        : "border-gray-100 dark:border-gray-700/50 text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${form.priority === p.value ? p.dot : "bg-gray-200 dark:bg-gray-600"}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle de notas */}
            {!showNotes ? (
              <button
                type="button"
                onClick={() => setShowNotes(true)}
                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1"
              >
                <FileText className="w-3 h-3" />
                Adicionar notas...
              </button>
            ) : (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <FileText className="w-3 h-3" />
                  Notas
                </label>
                <Textarea
                  placeholder="Detalhes adicionais..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="text-sm resize-none bg-gray-50 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700/50 rounded-xl focus-visible:ring-0 focus-visible:border-indigo-300 dark:focus-visible:border-indigo-500/40 placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-all"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedProject && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 shadow-sm">
                  <ProjectBadge project={selectedProject} />
                </span>
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
                disabled={!canSubmit}
                className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${canSubmit
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-500 active:scale-[0.98]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  }`}
              >
                {isEditing ? "Salvar alterações" : "Criar task"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}