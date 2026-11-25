import type { Text } from "./chapters.ts";

export interface Place {
  tab: string;
  section?: string;
}

interface QuestionBase {
  id: string;
  q: Text;
  explain: Text;
}

export interface ChoiceQuestion extends QuestionBase {
  kind: "choice";
  options: { text: Text; why?: Text }[];
  answer: number;
  compute?: () => number;
}

export interface NumberQuestion extends QuestionBase {
  kind: "number";
  label: Text;
  answer: number;
  tolerance?: number;
  hint: Text;
  compute: () => number;
}

export interface PredictQuestion extends QuestionBase {
  kind: "predict";
  options: Text[];
  answer: number;
  run: () => { answer: number; result: Text };
  tryIt: Place;
}

export type Question = ChoiceQuestion | NumberQuestion | PredictQuestion;

export interface PracticeSection {
  id: string;
  title: Text;
  intro: Text;
  read: Place;
  questions: Question[];
}

export function parseNumber(text: string): number | null {
  const clean = text.trim().replace(/[−–]/g, "-");
  if (!/^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/.test(clean)) return null;
  return Number(clean.replace(",", "."));
}

export const matches = (value: number, answer: number, tolerance = 1e-6): boolean =>
  Math.abs(value - answer) <= tolerance;

export function plainMath(text: string): string {
  return text
    .replace(/\\[()]/g, "")
    .replace(/\\mathbb\{([A-Z])\}/g, "$1")
    .replace(/\\mathbf\{([^}]+)\}/g, "$1")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\vec\{([^}]+)\}/g, "$1")
    .replace(/\\hat\s*\{?([a-zA-Z])\}?/g, "$1^")
    .replace(/\\bar\s*\{?([a-zA-Z])\}?/g, "$1-bar")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\infty/g, "∞")
    .replace(/\\pi/g, "π")
    .replace(/\\theta/g, "θ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\varepsilon|\\epsilon/g, "ε")
    .replace(/\\delta/g, "δ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\cdot/g, "·")
    .replace(/\\times/g, "×")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\ne/g, "≠")
    .replace(/\\to/g, "→")
    .replace(/\\approx/g, "≈")
    .replace(/\\perp/g, "⊥")
    .replace(/\\sum/g, "Σ")
    .replace(/\\int/g, "∫")
    .replace(/\\ln/g, "ln")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    .replace(/\\det/g, "det")
    .replace(/\\dim/g, "dim")
    .replace(/\\ker/g, "ker")
    .replace(/\\lim/g, "lim")
    .replace(/\{,\}/g, ",")
    .replace(/\\[ ,;]/g, " ")
    .replace(/[\^_]?\{([^}]+)\}/g, "$1")
    .replace(/[_^]/g, "")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type Status = "correct" | "revealed" | "missed";

export interface Answer {
  status: Status;
  pick?: number;
  value?: string;
}

type Store = Pick<Storage, "getItem" | "setItem">;
type Saved = Record<string, { total: number; answers: Record<string, Answer> }>;

const KEY = "math-practice-v1";

function browserStore(): Store | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readAll(store: Store | null): Saved {
  try {
    const data: unknown = JSON.parse(store?.getItem(KEY) ?? "{}");
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Saved) : {};
  } catch {
    return {};
  }
}

const validAnswer = (a: unknown): a is Answer =>
  Boolean(a) && typeof a === "object" && ["correct", "revealed", "missed"].includes((a as Answer).status);

export function createProgress(chapter: string, ids: readonly string[], store: Store | null = browserStore()) {
  const stored: unknown = readAll(store)[chapter]?.answers;
  const answers = new Map<string, Answer>();
  if (stored && typeof stored === "object") {
    for (const id of ids) {
      const a = (stored as Record<string, unknown>)[id];
      if (validAnswer(a)) answers.set(id, a);
    }
  }

  const save = (): void => {
    if (!store) return;
    try {
      const all = readAll(store);
      if (answers.size) all[chapter] = { total: ids.length, answers: Object.fromEntries(answers) };
      else delete all[chapter];
      store.setItem(KEY, JSON.stringify(all));
    } catch {
      /* ignore storage errors */
    }
  };

  return {
    get: (id: string): Answer | undefined => answers.get(id),
    set(id: string, answer: Answer): void {
      answers.set(id, answer);
      save();
    },
    clear(id: string): void {
      answers.delete(id);
      save();
    },
    clearAll(): void {
      answers.clear();
      save();
    },
    summary() {
      const done = answers.size;
      const correct = [...answers.values()].filter((a) => a.status === "correct").length;
      return { total: ids.length, done, correct };
    },
  };
}

export function chapterSummary(chapter: string, store: Store | null = browserStore()): { total: number; done: number } | null {
  const saved = readAll(store)[chapter];
  if (!saved || !Number.isInteger(saved.total) || saved.total <= 0 || !saved.answers || typeof saved.answers !== "object") {
    return null;
  }
  const done = Math.min(saved.total, Object.values(saved.answers).filter(validAnswer).length);
  return done ? { total: saved.total, done } : null;
}
