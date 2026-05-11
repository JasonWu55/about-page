export interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  category: string;
  status: "active" | "wip" | "concept";
  // Extended fields — add cols 8-9 in Google Sheet
  role?: string;        // col 8: e.g. "Product Planner & Developer"
  highlights?: string[]; // col 9: pipe-separated, e.g. "Designed API|Deployed Docker|AI Integration"
}

export interface SocialLink {
  label: string;
  url: string;
  type: "github" | "email" | "website" | "linkedin";
}

// Set NEXT_PUBLIC_GOOGLE_SHEET_CSV to your published CSV URL
// Sheet columns: title | description | tech(;sep) | link | github | category | status | role | highlights(|sep)
const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV ?? "";

const fallbackProjects: Project[] = [
  {
    title: "FJU All-in-One Student Portal",
    description:
      "非官方輔仁大學學生入口平台，整合課程資訊、校園地圖、廁所地圖、常用連結與校園服務，改善校園資訊分散問題。",
    tech: ["Next.js", "REST API", "PRD", "AI 輔助規劃"],
    category: "EdTech / Web App",
    status: "concept",
    role: "Product Planner · System Designer",
    highlights: [
      "規劃整合課程、地圖、廁所、常用連結等多模組功能",
      "從使用者需求出發撰寫 PRD 與資訊架構",
      "目標改善輔大校園資訊分散、體驗不一致問題",
    ],
  },
  {
    title: "多人即時知識問答遊戲",
    description:
      "類「知識王」的多人即時問答遊戲，包含玩家配對、遊戲開始、答題流程、結算與狀態重置。基於 WebSocket 概念設計。",
    tech: ["WebSocket", "Node.js", "React", "Matchmaking"],
    category: "Interactive / Gaming",
    status: "concept",
    role: "Full-Stack Designer",
    highlights: [
      "設計 matchmaking 流程：等待 → 配對 → 開始 → 結算",
      "拆解即時互動所需的前端狀態與後端事件流",
      "熟悉遊戲化學習產品的基礎互動邏輯",
    ],
  },
  {
    title: "Number Rollcall API",
    description:
      "可觸發後端任務的自動化驗證流程 API 服務，透過指定參數與 session 資訊執行一系列 HTTP 請求流程，含錯誤處理與狀態回傳。",
    tech: ["Node.js", "REST API", "Docker", "Nginx"],
    category: "Backend / Automation",
    status: "active",
    role: "Backend Developer · DevOps",
    highlights: [
      "設計 trigger endpoint、request body、headers 規格",
      "將手動流程抽象成可重複執行的後端 API",
      "部署於自架 Linux 伺服器，使用 Docker + Nginx",
    ],
  },
  {
    title: "AI 輔助題目解析工具",
    description:
      "瀏覽器端腳本，從網頁題目區塊解析題目選項並整理成 JSON，支援呼叫自訂 AI 後端服務取得答案建議，針對不同題型設計 fallback 流程。",
    tech: ["JavaScript", "Tampermonkey", "DOM Parsing", "AI API"],
    category: "AI / Frontend Script",
    status: "active",
    role: "Frontend Script Author",
    highlights: [
      "DOM Parsing 解析題目、選項，整理成結構化 JSON",
      "呼叫自訂 AI 後端取得答案建議",
      "針對非單選題設計 fallback — 傳送完整題目區塊給 AI",
    ],
  },
  {
    title: "自架服務與網域部署",
    description:
      "管理多個自有網域與子網域服務 (whalin.cc, lkto.cc, whl.tw)，設定 vhost、SSL 憑證、反向代理，處理 Gateway Timeout、Nginx 設定錯誤等實際問題。",
    tech: ["Linux", "Docker", "Nginx", "Cloudflare", "aaPanel"],
    category: "DevOps / Infrastructure",
    status: "active",
    role: "Systems Admin · DevOps",
    highlights: [
      "管理 whalin.cc、lkto.cc、whl.tw 多個網域",
      "Nginx vhost、SSL、反向代理完整設定",
      "實際排除 Gateway Timeout、Nginx 設定錯誤等線上問題",
    ],
  },
];

function parseCSV(text: string): Project[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const projects: Project[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.replace(/^"|"$/g, "").trim());
    if (!cols[0]) continue;
    projects.push({
      title: cols[0] ?? "",
      description: cols[1] ?? "",
      tech: (cols[2] ?? "").split(";").map((t) => t.trim()).filter(Boolean),
      link: cols[3] || undefined,
      github: cols[4] || undefined,
      category: cols[5] ?? "Project",
      status: (cols[6] as Project["status"]) ?? "active",
      role: cols[7] || undefined,
      highlights: cols[8]
        ? cols[8].split("|").map((h) => h.trim()).filter(Boolean)
        : undefined,
    });
  }
  return projects;
}

export async function fetchProjects(): Promise<Project[]> {
  if (!SHEET_URL) return fallbackProjects;
  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return fallbackProjects;
    const text = await res.text();
    const parsed = parseCSV(text);
    return parsed.length > 0 ? parsed : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/", type: "github" },
  { label: "Email", url: "mailto:woowujasonwu@gmail.com", type: "email" },
  { label: "Website", url: "https://whalin.cc", type: "website" },
];

// ── Terminal commands ─────────────────────────────────────────────────────
// CSV format (header row required): command,output
// output supports literal \n for line breaks
// Set NEXT_PUBLIC_TERMINAL_CSV_URL to a published Google Sheet CSV
export type TerminalCommands = Record<string, string>;

const TERMINAL_CSV_URL = process.env.NEXT_PUBLIC_TERMINAL_CSV_URL ?? "";

export const defaultTerminalCommands: TerminalCommands = {
  help: "Available commands:\n  whoami       — About me\n  skills       — Tech stack\n  projects     — Project list\n  contact      — Get in touch\n  availability — Work status\n  clear        — Clear terminal\n  echo [text]  — Echo text",
  whoami: "Jason\nMed Informatics @ 輔仁大學 FJU\nFull-Stack Dev Intern",
  skills:
    "Frontend   : React · Next.js · TypeScript · Tailwind CSS\nBackend    : Node.js · Express · REST API · SQL\nDevOps     : Docker · Nginx · Linux · Cloudflare · aaPanel\nAI / Tools : Claude Code · OpenRouter · AI API · Git",
  contact: "Email   : woowujasonwu@gmail.com\nWebsite : whalin.cc\nGitHub  : github.com/",
  availability:
    "Status    : Open to internship\nMode      : Hybrid / Remote-first\nSchedule  : Flexible, can arrange around class",
  projects:
    "1. FJU All-in-One Student Portal\n2. 多人即時知識問答遊戲\n3. Number Rollcall API\n4. AI 輔助題目解析工具\n5. 自架服務與網域部署",
};

function parseTerminalCSV(text: string): TerminalCommands {
  const lines = text.trim().split("\n").slice(1);
  const result: TerminalCommands = {};
  for (const line of lines) {
    const idx = line.indexOf(",");
    if (idx === -1) continue;
    const cmd = line.slice(0, idx).trim().toLowerCase();
    const out = line
      .slice(idx + 1)
      .replace(/^"|"$/g, "")
      .replace(/\\n/g, "\n")
      .trim();
    if (cmd) result[cmd] = out;
  }
  return result;
}

export async function fetchTerminalCommands(): Promise<TerminalCommands> {
  if (!TERMINAL_CSV_URL) return defaultTerminalCommands;
  try {
    const res = await fetch(TERMINAL_CSV_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return defaultTerminalCommands;
    const text = await res.text();
    const parsed = parseTerminalCSV(text);
    return Object.keys(parsed).length > 0
      ? { ...defaultTerminalCommands, ...parsed }
      : defaultTerminalCommands;
  } catch {
    return defaultTerminalCommands;
  }
}

// ── CSV line parser (handles quoted fields with commas) ───────────────────────
function splitCSVLine(line: string): string[] {
  const cols: string[] = [];
  let i = 0;
  while (i <= line.length) {
    if (i === line.length) { cols.push(""); break; }
    if (line[i] === '"') {
      i++;
      let field = "";
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') { field += '"'; i += 2; }
          else { i++; break; }
        } else {
          field += line[i++];
        }
      }
      cols.push(field.trim());
      if (line[i] === ',') i++;
    } else {
      const end = line.indexOf(',', i);
      if (end === -1) { cols.push(line.slice(i).trim()); break; }
      cols.push(line.slice(i, end).trim());
      i = end + 1;
    }
  }
  return cols;
}

// ── Site Config ───────────────────────────────────────────────────────────────
// CSV format (key,value). Special keys:
//   skill_badges  — semicolon-separated list
//   fact_<Label>  — Quick fact rows, e.g. fact_School,輔仁大學 FJU
export interface SiteConfig {
  name: string;
  badge: string;
  subtitle: string;
  skillBadges: string[];
  githubUrl: string;
  email: string;
  bio1Before: string;
  bio1Highlight: string;
  bio1After: string;
  bio2: string;
  bio3: string;
  facts: { label: string; value: string }[];
}

export const defaultSiteConfig: SiteConfig = {
  name: "Jason",
  badge: "Available for Internship · Full-Stack Dev",
  subtitle: "Full-Stack Dev · Med Informatics @ FJU · AI Tool Builder",
  skillBadges: ["React", "Next.js", "TypeScript", "Node.js", "Docker", "Linux", "Nginx", "Claude Code"],
  githubUrl: "https://github.com/",
  email: "woowujasonwu@gmail.com",
  bio1Before: "就讀輔仁大學",
  bio1Highlight: "醫學資訊與創新應用學士學位學程",
  bio1After: "，對 Web 全端開發、AI 工具整合、教育科技與產品原型設計有高度興趣。",
  bio2: "過去自主開發多個 Web / API / 自動化相關專案，包含即時互動系統、校園應用、AI 輔助流程、後端 API 與自架服務部署。擅長從需求發想、PRD 規劃到實作雛形，並習慣使用 AI Coding 工具提升開發效率。",
  bio3: "雖然仍在累積大型產品與團隊開發經驗，但能快速理解問題、拆解需求，主動查證技術文件與尋找可行解法。",
  facts: [
    { label: "School", value: "輔仁大學 FJU" },
    { label: "Program", value: "醫學資訊與創新應用" },
    { label: "Role", value: "Full-Stack Dev Intern" },
    { label: "Available", value: "Hybrid / Remote-first" },
    { label: "Location", value: "Taiwan" },
  ],
};

const SITE_CONFIG_CSV_URL = process.env.NEXT_PUBLIC_SITE_CONFIG_CSV ?? "";

function parseSiteConfigCSV(text: string): Partial<SiteConfig> {
  const lines = text.trim().split("\n").slice(1);
  const raw: Record<string, string> = {};
  const facts: { label: string; value: string }[] = [];

  for (const line of lines) {
    const idx = line.indexOf(",");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).replace(/^"|"$/g, "").trim();
    if (!key) continue;
    if (key.startsWith("fact_")) {
      facts.push({ label: key.slice(5), value: val });
    } else {
      raw[key] = val;
    }
  }

  const partial: Partial<SiteConfig> = {};
  if (raw.name) partial.name = raw.name;
  if (raw.badge) partial.badge = raw.badge;
  if (raw.subtitle) partial.subtitle = raw.subtitle;
  if (raw.skill_badges) partial.skillBadges = raw.skill_badges.split(";").map((s) => s.trim()).filter(Boolean);
  if (raw.github_url) partial.githubUrl = raw.github_url;
  if (raw.email) partial.email = raw.email;
  if (raw.bio1_before) partial.bio1Before = raw.bio1_before;
  if (raw.bio1_highlight) partial.bio1Highlight = raw.bio1_highlight;
  if (raw.bio1_after) partial.bio1After = raw.bio1_after;
  if (raw.bio2) partial.bio2 = raw.bio2;
  if (raw.bio3) partial.bio3 = raw.bio3;
  if (facts.length > 0) partial.facts = facts;
  return partial;
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  if (!SITE_CONFIG_CSV_URL) return defaultSiteConfig;
  try {
    const res = await fetch(SITE_CONFIG_CSV_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return defaultSiteConfig;
    const text = await res.text();
    const partial = parseSiteConfigCSV(text);
    return { ...defaultSiteConfig, ...partial };
  } catch {
    return defaultSiteConfig;
  }
}

// ── Skills ────────────────────────────────────────────────────────────────────
// CSV columns: id,title,subtitle,content,category,icon,relatedIds,status,energy
//   relatedIds — semicolon-separated numbers, e.g. 2;5;6
//   icon       — name string, mapped to component in skills.tsx
//   status     — completed | in-progress | pending
export interface SkillNodeData {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  icon: string;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export const defaultSkills: SkillNodeData[] = [
  {
    id: 1,
    title: "Frontend",
    subtitle: "React · Next.js",
    content: "React.js, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind CSS, 狀態管理與前後端整合",
    category: "Frontend",
    icon: "monitor",
    relatedIds: [2, 5, 6],
    status: "completed",
    energy: 82,
  },
  {
    id: 2,
    title: "Backend / API",
    subtitle: "Node.js · Express",
    content: "Node.js, Express, REST API, JSON 處理, 錯誤處理, SQL/MySQL 基礎, 驗證流程",
    category: "Backend",
    icon: "server",
    relatedIds: [1, 3],
    status: "completed",
    energy: 76,
  },
  {
    id: 3,
    title: "DevOps",
    subtitle: "Docker · Linux",
    content: "Linux Server, Docker, Docker Compose, Nginx, aaPanel, Reverse Proxy, SSL/TLS",
    category: "DevOps",
    icon: "box",
    relatedIds: [2, 4],
    status: "completed",
    energy: 72,
  },
  {
    id: 4,
    title: "AI Tools",
    subtitle: "Claude · OpenRouter",
    content: "Claude Code, Cursor, Copilot, OpenRouter, AI API 串接, AI Agent 規劃, MCP Server",
    category: "AI",
    icon: "bot",
    relatedIds: [1, 5],
    status: "in-progress",
    energy: 88,
  },
  {
    id: 5,
    title: "Git / GitHub",
    subtitle: "Version Control",
    content: "Git, GitHub, 版本控制, Branch 管理, PR flow, 專案管理",
    category: "Tools",
    icon: "git-branch",
    relatedIds: [1, 2, 6],
    status: "completed",
    energy: 90,
  },
  {
    id: 6,
    title: "Languages",
    subtitle: "JS · TS · Python",
    content: "JavaScript, TypeScript, Python, Shell Script, 能快速適應新語言",
    category: "Languages",
    icon: "code2",
    relatedIds: [1, 2],
    status: "completed",
    energy: 84,
  },
  {
    id: 7,
    title: "Cloudflare",
    subtitle: "DNS · Proxy",
    content: "Cloudflare DNS 管理, Proxy 設定, SSL 自動化, 基礎安全設定, 多網域管理",
    category: "Infrastructure",
    icon: "globe",
    relatedIds: [3],
    status: "completed",
    energy: 68,
  },
  {
    id: 8,
    title: "Scripting",
    subtitle: "Automation",
    content: "Shell Script, Tampermonkey, Browser 自動化, DOM Parsing, 流程自動化設計",
    category: "Scripting",
    icon: "terminal",
    relatedIds: [4, 6],
    status: "in-progress",
    energy: 74,
  },
];

const SKILLS_CSV_URL = process.env.NEXT_PUBLIC_SKILLS_CSV ?? "";

function parseSkillsCSV(text: string): SkillNodeData[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const result: SkillNodeData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = splitCSVLine(lines[i]);
    if (!c[0]) continue;
    result.push({
      id: parseInt(c[0]) || i,
      title: c[1] ?? "",
      subtitle: c[2] ?? "",
      content: c[3] ?? "",
      category: c[4] ?? "",
      icon: c[5] ?? "monitor",
      relatedIds: (c[6] ?? "").split(";").map(Number).filter(Boolean),
      status: (c[7] as SkillNodeData["status"]) ?? "completed",
      energy: parseInt(c[8]) || 70,
    });
  }
  return result;
}

export async function fetchSkills(): Promise<SkillNodeData[]> {
  if (!SKILLS_CSV_URL) return defaultSkills;
  try {
    const res = await fetch(SKILLS_CSV_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return defaultSkills;
    const text = await res.text();
    const parsed = parseSkillsCSV(text);
    return parsed.length > 0 ? parsed : defaultSkills;
  } catch {
    return defaultSkills;
  }
}

// ── Experience ────────────────────────────────────────────────────────────────
// CSV columns: period,role,org,desc,tags,icon,accent
//   tags   — pipe-separated, e.g. Docker|Nginx|Linux
//   icon   — microphone | server | code | graduation-cap
//   accent — indigo | violet | cyan | emerald
export interface ExperienceItemData {
  period: string;
  role: string;
  org: string;
  desc: string;
  tags: string[];
  icon: string;
  accent: string;
}

export const defaultExperience: ExperienceItemData[] = [
  {
    period: "2023 – Present",
    role: "製播組 Technical Crew",
    org: "SITCON · COSCUP · MOPCON",
    desc: "參與台灣技術社群大型活動製播工作，熟悉跨團隊溝通、直播技術、現場流程協調與即時問題處理。在高壓活動現場中累積快速排錯、溝通協作與責任分工經驗。",
    tags: ["Live Streaming", "A/V Tech", "Cross-team Collab"],
    icon: "microphone",
    accent: "indigo",
  },
  {
    period: "2023 – Present",
    role: "Self-Directed Projects",
    org: "Personal / Side Projects",
    desc: "自主規劃並開發多個 Web/API/自動化相關專案，從需求發想、PRD 撰寫、系統設計到部署維運獨立完成。管理多個自有網域（whalin.cc、lkto.cc、whl.tw）。",
    tags: ["Node.js", "Docker", "Nginx", "Cloudflare"],
    icon: "server",
    accent: "violet",
  },
  {
    period: "2023 – Present",
    role: "AI Tooling & Automation",
    org: "Side Exploration",
    desc: "探索 AI 工具整合至開發流程，包含 Claude Code、OpenRouter API 串接、Tampermonkey 腳本、AI 輔助答題工具與 MCP Server 規劃概念。",
    tags: ["Claude Code", "OpenRouter", "LLM API", "Automation"],
    icon: "code",
    accent: "cyan",
  },
  {
    period: "2023 – Present",
    role: "B.S. Student",
    org: "輔仁大學 Fu Jen Catholic University",
    desc: "醫學資訊與創新應用學士學位學程，學習方向涵蓋醫學資訊、資訊系統應用、Web/App 開發、資料處理、AI 應用與創新服務設計。",
    tags: ["Med Informatics", "Web Dev", "AI Applications"],
    icon: "graduation-cap",
    accent: "emerald",
  },
];

const EXPERIENCE_CSV_URL = process.env.NEXT_PUBLIC_EXPERIENCE_CSV ?? "";

function parseExperienceCSV(text: string): ExperienceItemData[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const result: ExperienceItemData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = splitCSVLine(lines[i]);
    if (!c[0]) continue;
    result.push({
      period: c[0] ?? "",
      role: c[1] ?? "",
      org: c[2] ?? "",
      desc: c[3] ?? "",
      tags: (c[4] ?? "").split("|").map((t) => t.trim()).filter(Boolean),
      icon: c[5] ?? "code",
      accent: c[6] ?? "indigo",
    });
  }
  return result;
}

export async function fetchExperience(): Promise<ExperienceItemData[]> {
  if (!EXPERIENCE_CSV_URL) return defaultExperience;
  try {
    const res = await fetch(EXPERIENCE_CSV_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return defaultExperience;
    const text = await res.text();
    const parsed = parseExperienceCSV(text);
    return parsed.length > 0 ? parsed : defaultExperience;
  } catch {
    return defaultExperience;
  }
}
