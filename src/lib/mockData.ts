// Centralized mock analytics. All data is deterministically seeded by the
// active Selection so changing week / month / year / custom range / platform
// always reshuffles every metric, chart and counter — but is stable on revisit.

export type SelectionKind = "weekly" | "monthly" | "yearly" | "custom";

export interface Selection {
  kind: SelectionKind;
  /** Unique stable identifier — drives every seeded metric. */
  key: string;
  /** Human readable label shown in UI. */
  label: string;
  /** Sub-label / hint */
  hint?: string;
}

export type Point = { label: string; value: number; secondary?: number };

// ---------- Seeded RNG ----------
const fnv1a = (s: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rngFor = (...parts: (string | number)[]) => mulberry(fnv1a(parts.join("|")));

// ---------- Default selection helpers ----------
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

const pad = (n: number) => n.toString().padStart(2, "0");

export const defaultSelection = (): Selection => ({
  kind: "monthly",
  key: "monthly:2026-05",
  label: "May 2026",
});

export const weeklySelection = (which: "this" | "last" | string, label?: string, hint?: string): Selection => ({
  kind: "weekly",
  key: `weekly:${which}`,
  label: label ?? (which === "this" ? "This Week" : which === "last" ? "Last Week" : "Custom Week"),
  hint,
});

export const monthlySelection = (year: number, month: number): Selection => ({
  kind: "monthly",
  key: `monthly:${year}-${pad(month + 1)}`,
  label: `${MONTHS[month]} ${year}`,
});

export const yearlySelection = (year: number): Selection => ({
  kind: "yearly",
  key: `yearly:${year}`,
  label: `${year}`,
});

export const customSelection = (from: Date, to: Date): Selection => ({
  kind: "custom",
  key: `custom:${from.toISOString().slice(0,10)}_${to.toISOString().slice(0,10)}`,
  label: `${from.toLocaleDateString(undefined,{month:"short",day:"numeric"})} – ${to.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}`,
});

// ---------- Labels per selection ----------
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const labelsFor = (sel: Selection): string[] => {
  if (sel.kind === "weekly") return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  if (sel.kind === "yearly") return MONTHS.map(m => m.slice(0,3));
  if (sel.kind === "monthly") {
    const m = sel.key.match(/monthly:(\d{4})-(\d{2})/);
    if (m) {
      const y = +m[1], mo = +m[2] - 1;
      return Array.from({ length: daysInMonth(y, mo) }, (_, i) => `${i + 1}`);
    }
    return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  }
  // custom — derive number of days from key
  const c = sel.key.match(/custom:(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})/);
  if (c) {
    const a = new Date(c[1]).getTime();
    const b = new Date(c[2]).getTime();
    const days = Math.max(1, Math.round((b - a) / 86400000) + 1);
    return Array.from({ length: Math.min(days, 31) }, (_, i) => `D${i + 1}`);
  }
  return Array.from({ length: 14 }, (_, i) => `D${i + 1}`);
};

// ---------- Series ----------
export const seriesFor = (sel: Selection, base: number, salt: string = ""): Point[] => {
  const ls = labelsFor(sel);
  const r = rngFor(sel.key, salt, base);
  // each selection gets a unique trend signature
  const trend = -0.3 + r() * 1.4;       // -0.3 to +1.1 over the period
  const wobble = 0.18 + r() * 0.45;     // jitter strength
  const phase = r() * Math.PI * 2;
  const freq = 1 + r() * 3;
  return ls.map((label, i) => {
    const t = i / Math.max(1, ls.length - 1);
    const wave = Math.sin(phase + t * Math.PI * freq) * wobble;
    const noise = (r() - 0.5) * wobble;
    const k = 1 + trend * t + wave + noise;
    const v = Math.max(0, base * k);
    const s = Math.max(0, base * 0.55 * (1 + trend * t * 0.7 + Math.cos(phase * 1.3 + t * Math.PI * (freq + 1)) * wobble * 0.8 + (r() - 0.5) * wobble));
    return { label, value: Math.round(v), secondary: Math.round(s) };
  });
};

// ---------- Platform overview ----------
export type PlatformId = "youtube" | "linkedin" | "instagram" | "facebook" | "twitter";

export interface PlatformOverview {
  id: PlatformId;
  name: string;
  followers: number;
  growth: number;
  engagement: number;
  reach: number;
  color: string;
}

const PLATFORMS_BASE: PlatformOverview[] = [
  { id: "youtube",   name: "YouTube",   followers: 184230, growth: 12.4, engagement: 7.8, reach: 2_410_000, color: "var(--brand-magenta)" },
  { id: "linkedin",  name: "LinkedIn",  followers:  72540, growth:  8.9, engagement: 5.4, reach: 1_120_000, color: "var(--brand-cyan)" },
  { id: "instagram", name: "Instagram", followers: 312880, growth: 15.7, engagement: 9.2, reach: 4_780_000, color: "var(--brand-violet)" },
  { id: "facebook",  name: "Facebook",  followers: 156320, growth:  4.1, engagement: 3.6, reach: 1_980_000, color: "var(--chart-4)" },
  { id: "twitter",   name: "Twitter",   followers:  98760, growth: 11.2, engagement: 6.1, reach: 2_050_000, color: "var(--chart-5)" },
];

export const derivePlatform = (p: PlatformOverview, sel: Selection): PlatformOverview => {
  const r = rngFor(p.id, sel.key);
  const fMul = 0.78 + r() * 0.55;
  const rMul = 0.55 + r() * 0.95;
  const eMul = 0.6 + r() * 1.1;
  const growth = -3 + r() * 26;
  return {
    ...p,
    followers: Math.round(p.followers * fMul),
    reach: Math.round(p.reach * rMul),
    engagement: +(p.engagement * eMul).toFixed(1),
    growth: +growth.toFixed(1),
  };
};

export const getPlatforms = (sel: Selection): PlatformOverview[] =>
  PLATFORMS_BASE.map((p) => derivePlatform(p, sel));

export const PLATFORMS = PLATFORMS_BASE;

// ---------- Engagement breakdown ----------
export const engagementBreakdownFor = (sel: Selection, scale = 1) => {
  const r = rngFor(sel.key, "engagement");
  const base = [4820, 1230, 870, 540];
  const names = ["Likes", "Comments", "Shares", "Saves"];
  return names.map((name, i) => ({
    name,
    value: Math.round(base[i] * (0.5 + r() * 1.4) * scale),
  }));
};

export const engagementBreakdown = engagementBreakdownFor(defaultSelection());

// ---------- Heatmap ----------
export const heatmapFor = (sel: Selection) => {
  const r = rngFor(sel.key, "heatmap");
  return Array.from({ length: 7 * 24 }, (_, i) => ({
    day: Math.floor(i / 24),
    hour: i % 24,
    value: Math.round(r() * 100),
  }));
};

export const heatmapData = heatmapFor(defaultSelection());

// ---------- Platform-specific (seeded by selection) ----------
export interface YouTubeData {
  subscribers: number; views: number; likes: number; dislikes: number;
  comments: number; videosPosted: number; watchTimeHrs: number;
  topVideo: { title: string; views: number };
  engagementRatio: number;
}
const YT_TITLES = [
  "AI Marketing in 2026 — Full Breakdown",
  "We Rebuilt a Brand With AI in 24 Hours",
  "The Algorithm Doesn't Want You to See This",
  "Inside Scalio's Content Engine",
  "How a 60s Reel Outperformed a TV Ad",
];
export const getYouTube = (sel: Selection = defaultSelection()): YouTubeData => {
  const r = rngFor(sel.key, "youtube");
  return {
    subscribers: Math.round(184230 * (0.7 + r() * 0.7)),
    views: Math.round(12_840_000 * (0.5 + r() * 1.2)),
    likes: Math.round(482300 * (0.5 + r() * 1.2)),
    dislikes: Math.round(9120 * (0.5 + r() * 1.2)),
    comments: Math.round(38420 * (0.5 + r() * 1.2)),
    videosPosted: Math.round(20 + r() * 200),
    watchTimeHrs: Math.round(318420 * (0.4 + r() * 1.4)),
    topVideo: { title: YT_TITLES[Math.floor(r() * YT_TITLES.length)], views: Math.round(800_000 + r() * 1_900_000) },
    engagementRatio: +(3 + r() * 8).toFixed(1),
  };
};

export interface LinkedInData {
  followers: number; posts: number; likes: number; comments: number;
  reach: number; impressions: number; reposts: number;
}
export const getLinkedIn = (sel: Selection = defaultSelection()): LinkedInData => {
  const r = rngFor(sel.key, "linkedin");
  return {
    followers: Math.round(72540 * (0.7 + r() * 0.7)),
    posts: Math.round(40 + r() * 240),
    likes: Math.round(41280 * (0.5 + r() * 1.2)),
    comments: Math.round(6210 * (0.5 + r() * 1.3)),
    reach: Math.round(1_120_000 * (0.5 + r() * 1.4)),
    impressions: Math.round(2_840_000 * (0.5 + r() * 1.4)),
    reposts: Math.round(4820 * (0.4 + r() * 1.4)),
  };
};

export interface InstagramData {
  posts: number; reels: number; views: number; likes: number; comments: number;
  shares: number; reach: number; engagement: number;
  topReel: { title: string; views: number };
}
const IG_TITLES = [
  "60s AI Ad That Hit 2.4M Views",
  "BTS: Building a Brand in a Day",
  "POV: You Discover the Algorithm",
  "Studio Tour — Scalio HQ",
  "Three Hooks That Stopped Scrolls",
];
export const getInstagram = (sel: Selection = defaultSelection()): InstagramData => {
  const r = rngFor(sel.key, "instagram");
  return {
    posts: Math.round(60 + r() * 320),
    reels: Math.round(40 + r() * 220),
    views: Math.round(8_240_000 * (0.5 + r() * 1.3)),
    likes: Math.round(612400 * (0.5 + r() * 1.3)),
    comments: Math.round(48210 * (0.5 + r() * 1.3)),
    shares: Math.round(28140 * (0.5 + r() * 1.3)),
    reach: Math.round(4_780_000 * (0.5 + r() * 1.3)),
    engagement: +(4 + r() * 9).toFixed(1),
    topReel: { title: IG_TITLES[Math.floor(r() * IG_TITLES.length)], views: Math.round(900_000 + r() * 2_500_000) },
  };
};

export interface FacebookData {
  posts: number; reels: number; views: number; likes: number; comments: number;
  topContent: { title: string; views: number };
  engagement: number;
}
const FB_TITLES = [
  "Behind the Scenes — Scalio Studio",
  "Live Q&A: AI in Performance Marketing",
  "Community Spotlight: April Edition",
  "Our Most Viral Campaign Ever",
];
export const getFacebook = (sel: Selection = defaultSelection()): FacebookData => {
  const r = rngFor(sel.key, "facebook");
  return {
    posts: Math.round(60 + r() * 240),
    reels: Math.round(20 + r() * 140),
    views: Math.round(3_240_000 * (0.5 + r() * 1.3)),
    likes: Math.round(184200 * (0.5 + r() * 1.3)),
    comments: Math.round(21400 * (0.5 + r() * 1.3)),
    topContent: { title: FB_TITLES[Math.floor(r() * FB_TITLES.length)], views: Math.round(200_000 + r() * 800_000) },
    engagement: +(2 + r() * 6).toFixed(1),
  };
};

export interface TwitterData {
  posts: number; followers: number; reach: number; views: number;
  likes: number; reposts: number; engagement: number;
}
export const getTwitter = (sel: Selection = defaultSelection()): TwitterData => {
  const r = rngFor(sel.key, "twitter");
  return {
    posts: Math.round(200 + r() * 1500),
    followers: Math.round(98760 * (0.7 + r() * 0.7)),
    reach: Math.round(2_050_000 * (0.5 + r() * 1.4)),
    views: Math.round(5_280_000 * (0.5 + r() * 1.4)),
    likes: Math.round(142800 * (0.5 + r() * 1.3)),
    reposts: Math.round(24800 * (0.5 + r() * 1.3)),
    engagement: +(3 + r() * 7).toFixed(1),
  };
};

export const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
};

// Back-compat alias for older code paths
export type Timeframe = SelectionKind;
