"use client";
import React from "react";
import { motion } from "motion/react";
import { type ExperienceItemData } from "@/lib/data";

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactElement> = {
  microphone: MicrophoneIcon,
  server: ServerIcon,
  code: CodeIcon,
  "graduation-cap": GraduationCapIcon,
};

const accentMap: Record<string, string> = {
  indigo: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  violet: "bg-violet-500/10 border-violet-500/30 text-violet-400",
  cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
};

const dotMap: Record<string, string> = {
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
};

const tagMap: Record<string, string> = {
  indigo: "border-indigo-800 text-indigo-400",
  violet: "border-violet-800 text-violet-400",
  cyan: "border-cyan-800 text-cyan-400",
  emerald: "border-emerald-800 text-emerald-400",
};

export default function Experience({ experience }: { experience: ExperienceItemData[] }) {
  return (
    <section id="experience" className="bg-zinc-950 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-indigo-400 mb-2">
            Experience
          </h2>
          <p className="text-2xl md:text-3xl font-light text-zinc-300">
            Background
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-10">
            {experience.map((exp, i) => {
              const Icon = iconMap[exp.icon] ?? CodeIcon;
              return (
                <motion.div
                  key={exp.role}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-16 md:pl-20"
                >
                  {/* Icon dot */}
                  <div
                    className={`absolute left-3 md:left-4 top-1 w-7 h-7 rounded-full border flex items-center justify-center ${accentMap[exp.accent]}`}
                  >
                    <Icon />
                  </div>
                  {/* Timeline dot */}
                  <div className={`absolute left-[21px] md:left-[29px] top-3.5 w-2 h-2 rounded-full ${dotMap[exp.accent]} z-10`} />

                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-zinc-600">{exp.period}</span>
                      <span className="text-xs text-zinc-700">·</span>
                      <span className="text-xs text-zinc-500">{exp.org}</span>
                    </div>
                    <h3 className="text-zinc-100 font-semibold text-base mb-3">{exp.role}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{exp.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 text-[11px] rounded border bg-transparent ${tagMap[exp.accent]}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
