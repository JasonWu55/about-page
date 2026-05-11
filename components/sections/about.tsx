"use client";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { motion, useInView } from "motion/react";
import { type TerminalCommands, type SiteConfig } from "@/lib/data";

/* ── Types ───────────────────────────────────────────────────────────── */
interface Line {
  type: "input" | "output" | "error" | "welcome" | "hint";
  text: string;
}

const BUILTIN = ["clear", "echo"];

/* ── Interactive Terminal ────────────────────────────────────────────── */
function InteractiveTerminal({ commands }: { commands: TerminalCommands }) {
  const allCommands = [...BUILTIN, ...Object.keys(commands)].sort();

  const WELCOME: Line[] = [
    { type: "welcome", text: "jason@portfolio ~ bash" },
    { type: "welcome", text: 'Type "help" to see available commands.' },
  ];

  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) {
      setLines((l) => [...l, { type: "input", text: "" }]);
      return;
    }
    setHistory((h) => [trimmed, ...h]);
    setHistIdx(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");
    const inputLine: Line = { type: "input", text: trimmed };

    if (cmd === "clear") {
      setLines(WELCOME);
      return;
    }
    if (cmd === "echo") {
      setLines((l) => [...l, inputLine, { type: "output", text: args }]);
      return;
    }

    const response = commands[cmd];
    if (response !== undefined) {
      const outLines: Line[] = response
        .split("\n")
        .map((t) => ({ type: "output" as const, text: t }));
      setLines((l) => [...l, inputLine, ...outLines]);
    } else {
      setLines((l) => [
        ...l,
        inputLine,
        { type: "error", text: `command not found: ${cmd}  (try "help")` },
      ]);
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;

      // Only complete first token
      if (partial.includes(" ")) return;

      const matches = allCommands.filter((c) => c.startsWith(partial));

      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        // Show matches as a hint line without executing
        setLines((l) => [
          ...l,
          { type: "input", text: partial },
          { type: "hint", text: matches.join("   ") },
        ]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
      return;
    }
  }

  return (
    <div
      className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm overflow-hidden font-mono text-sm flex flex-col cursor-text"
      style={{ height: 340 }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800 bg-zinc-950/60 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-zinc-600">jason@portfolio ~ bash</span>
        <span className="ml-auto text-[10px] text-zinc-700">Tab to complete</span>
      </div>

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.type === "welcome" && (
              <span className="text-zinc-500 text-xs">{line.text}</span>
            )}
            {line.type === "input" && (
              <span>
                <span className="text-indigo-400 mr-2 select-none">$</span>
                <span className="text-zinc-200">{line.text}</span>
              </span>
            )}
            {line.type === "output" && (
              <span className="text-emerald-400/80 pl-4 whitespace-pre">{line.text || " "}</span>
            )}
            {line.type === "hint" && (
              <span className="text-zinc-500 pl-4">{line.text}</span>
            )}
            {line.type === "error" && (
              <span className="text-red-400/80 pl-4">{line.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-950/40 shrink-0">
        <span className="text-indigo-400 select-none shrink-0">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 bg-transparent text-zinc-200 outline-none caret-indigo-400 placeholder-zinc-700"
          placeholder="type a command..."
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="w-2 h-4 bg-indigo-400 rounded-sm shrink-0"
        />
      </div>
    </div>
  );
}

/* ── Quick facts ─────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

/* ── Section ─────────────────────────────────────────────────────────── */
export default function About({ config, commands }: { config: SiteConfig; commands: TerminalCommands }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="bg-zinc-950 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-indigo-400 mb-2">
            About
          </h2>
          <p className="text-2xl md:text-3xl font-light text-zinc-300">Who I am</p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — bio + quick facts */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={item} className="space-y-4">
              <p className="text-zinc-200 text-lg leading-relaxed">
                {config.bio1Before}{" "}
                <span className="text-indigo-300 font-medium">
                  {config.bio1Highlight}
                </span>
                {config.bio1After}
              </p>
              <p className="text-zinc-400 leading-relaxed">
                {config.bio2}
              </p>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {config.bio3}
              </p>
            </motion.div>

            <motion.dl variants={item} className="grid grid-cols-2 gap-x-8 gap-y-4">
              {config.facts.map((f) => (
                <div key={f.label} className="border-b border-zinc-800 pb-3">
                  <dt className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
                    {f.label}
                  </dt>
                  <dd className="text-zinc-300 text-sm">{f.value}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.div variants={item}>
              <a
                href={`mailto:${config.email}`}
                className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
              >
                Get in touch
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right — interactive terminal */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InteractiveTerminal commands={commands} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
