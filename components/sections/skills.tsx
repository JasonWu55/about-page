"use client";
import { motion } from "motion/react";
import {
  Monitor,
  Server,
  Box,
  Bot,
  GitBranch,
  Code2,
  Globe,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import RadialOrbitalTimeline, {
  type TimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { type SkillNodeData } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  monitor: Monitor,
  server: Server,
  box: Box,
  bot: Bot,
  "git-branch": GitBranch,
  code2: Code2,
  globe: Globe,
  terminal: Terminal,
};

function toTimelineItem(s: SkillNodeData): TimelineItem {
  return {
    id: s.id,
    title: s.title,
    date: s.subtitle,
    content: s.content,
    category: s.category,
    icon: iconMap[s.icon] ?? Monitor,
    relatedIds: s.relatedIds,
    status: s.status,
    energy: s.energy,
  };
}

export default function Skills({ skills }: { skills: SkillNodeData[] }) {
  return (
    <section id="skills" className="bg-zinc-950 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-indigo-400 mb-2">
            Skills
          </h2>
          <p className="text-2xl md:text-3xl font-light text-zinc-300 mb-2">
            Tech Stack
          </p>
          <p className="text-zinc-500 text-sm mb-8">
            點擊節點查看技術細節 — Click a node to explore
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        {/* Subtle bg glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />
        <RadialOrbitalTimeline timelineData={skills.map(toTimelineItem)} />
      </motion.div>

      {/* Legend */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600">
          {[
            { color: "bg-zinc-100", label: "Active / Proficient" },
            { color: "bg-indigo-500/30 border border-indigo-500/60", label: "Actively Learning" },
            { color: "bg-zinc-800/40 border border-zinc-700", label: "Exploring" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
