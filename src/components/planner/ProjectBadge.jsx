import React from "react";
import { DOT_COLOR_MAP } from "@/lib/constants";

export default function ProjectBadge({ project }) {
  if (!project) return null;
  const dot = DOT_COLOR_MAP[project.color] || DOT_COLOR_MAP.indigo;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {project.name}
    </span>
  );
}