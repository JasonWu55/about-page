"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Project } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

/* ── SVG icons ───────────────────────────────────────────────────────── */
function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 438.549 438.549" className={className} fill="currentColor">
      <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
    </svg>
  );
}
function MaximizeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Status map ──────────────────────────────────────────────────────── */
const statusMap = {
  active: { label: "Active", variant: "accent" as const },
  wip: { label: "WIP", variant: "outline" as const },
  concept: { label: "Concept", variant: "muted" as const },
};

/* ── Window title-bar dots ───────────────────────────────────────────── */
function TrafficLights({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
        aria-label="Close"
      />
      <span className="w-3 h-3 rounded-full bg-yellow-500/50 cursor-default" />
      <span className="w-3 h-3 rounded-full bg-green-500/50 cursor-default" />
    </div>
  );
}

/* ── Project card — window style ─────────────────────────────────────── */
function ProjectWindow({
  project,
  index,
  onExpand,
}: {
  project: Project;
  index: number;
  onExpand: () => void;
}) {
  const status = statusMap[project.status] ?? statusMap.concept;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm shadow-lg shadow-black/30 overflow-hidden hover:border-zinc-700 transition-colors"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950/70 border-b border-zinc-800">
        <TrafficLights />
        <span className="flex-1 text-center text-xs text-zinc-500 truncate select-none">
          {project.title}
        </span>
        {/* Expand hint */}
        <button
          onClick={onExpand}
          title="Expand"
          className="flex items-center gap-1 text-zinc-600 hover:text-zinc-300 transition-colors group"
        >
          <span className="text-[10px] hidden group-hover:inline opacity-0 group-hover:opacity-100 transition-opacity">
            expand
          </span>
          <MaximizeIcon />
        </button>
      </div>

      {/* Content — clickable to expand */}
      <div
        className="flex flex-col flex-1 p-5 gap-3 cursor-pointer"
        onClick={onExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onExpand()}
        aria-label={`Expand ${project.title}`}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-zinc-100 font-semibold text-sm leading-snug">{project.title}</h3>
            <p className="text-[11px] text-zinc-600 mt-0.5">{project.category}</p>
          </div>
          <Badge variant={status.variant} className="shrink-0 text-[10px]">
            {status.label}
          </Badge>
        </div>

        {/* Description — truncated */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{project.description}</p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded border border-zinc-800 text-zinc-600 bg-zinc-900">
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] text-zinc-700">
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Status bar hint */}
      <div className="px-4 py-2 border-t border-zinc-800/60 bg-zinc-950/40 flex items-center justify-between">
        <span className="text-[10px] text-zinc-700 font-mono">
          {project.tech.length} dependencies
        </span>
        <button
          onClick={onExpand}
          className="text-[10px] text-zinc-600 hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          Click to expand
          <MaximizeIcon />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Expanded modal window ───────────────────────────────────────────── */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const status = statusMap[project.status] ?? statusMap.concept;

  // Close on Escape
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock scroll — scrollbar-gutter:stable in CSS means no layout shift
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3 bg-zinc-950/80 border-b border-zinc-800 shrink-0">
          <TrafficLights onClose={onClose} />
          <span className="flex-1 text-center text-xs text-zinc-400 font-medium select-none">
            {project.title}
          </span>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-0.5"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">{project.title}</h2>
              <p className="text-sm text-zinc-500 mt-1">{project.category}</p>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          {/* Role badge */}
          {project.role && (
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-xs text-zinc-500">{project.role}</span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-zinc-800" />

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Description</h3>
            <p className="text-zinc-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Highlights</h3>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 mt-0.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs rounded-md border border-zinc-700 text-zinc-300 bg-zinc-800/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {(project.link || project.github) && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Links</h3>
              <div className="flex flex-wrap gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-600/30 transition-colors"
                  >
                    <ExternalLinkIcon />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
                  >
                    <GithubIcon />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-3 bg-zinc-950/60 border-t border-zinc-800 shrink-0 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-700">
            {project.tech.length} deps &nbsp;·&nbsp; {project.category}
          </span>
          <button
            onClick={onClose}
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Close &nbsp;(Esc)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */
export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState<Project | null>(null);
  const close = useCallback(() => setExpanded(null), []);

  return (
    <section id="projects" className="bg-zinc-950 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-indigo-400 mb-2">
            Projects
          </h2>
          <p className="text-2xl md:text-3xl font-light text-zinc-300">What I&apos;ve built</p>
          <p className="mt-2 text-zinc-600 text-sm">
            Click any window to expand &nbsp;·&nbsp; 資料可透過 Google Sheet CSV 更新
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectWindow
              key={project.title}
              project={project}
              index={i}
              onExpand={() => setExpanded(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {expanded && <ProjectModal project={expanded} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
