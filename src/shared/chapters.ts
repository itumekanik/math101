export interface Text {
  tr: string;
  en: string;
}

export type PartId = "foundations" | "linalg" | "calculus" | "series-int" | "complex";

export interface PartInfo {
  id: PartId;
  roman: string;
  short: Text;
  title: Text;
  range: Text;
}

export const PARTS: PartInfo[] = [
  {
    id: "foundations",
    roman: "I",
    short: { tr: "Temeller & Geometri", en: "Foundations & Geometry" },
    title: { tr: "Fonksiyonlar, Vektörler ve Analitik Geometri", en: "Functions, Vectors and Analytic Geometry" },
    range: { tr: "Ders 1–5", en: "Lectures 1–5" },
  },
  {
    id: "linalg",
    roman: "II",
    short: { tr: "Lineer Cebir", en: "Linear Algebra" },
    title: { tr: "Matrisler, Sistemler, Vektör ve İç Çarpım Uzayları", en: "Matrices, Systems, Vector & Inner Product Spaces" },
    range: { tr: "Ders 6–12", en: "Lectures 6–12" },
  },
  {
    id: "calculus",
    roman: "III",
    short: { tr: "Limit & Türev", en: "Limits & Derivatives" },
    title: { tr: "Limit, Süreklilik ve Türev Uygulamaları", en: "Limits, Continuity and Applications of Derivatives" },
    range: { tr: "Ders 13–15", en: "Lectures 13–15" },
  },
  {
    id: "series-int",
    roman: "IV",
    short: { tr: "Seriler & İntegral", en: "Series & Integrals" },
    title: { tr: "Diziler, Seriler ve İntegral Hesabı", en: "Sequences, Series and Integral Calculus" },
    range: { tr: "Ders 16–20", en: "Lectures 16–20" },
  },
  {
    id: "complex",
    roman: "V",
    short: { tr: "Karmaşık Sayılar", en: "Complex Numbers" },
    title: { tr: "Karmaşık Sayılar ve Euler Formülü", en: "Complex Numbers and Euler's Formula" },
    range: { tr: "Ders 21", en: "Lecture 21" },
  },
];

export interface ChapterInfo {
  id: string;
  number: number;
  url: string | null;
  lecture: string;
  part: PartId;
  short: string;
  title: Text;
  sub: Text;
}

declare const __CHAPTERS__: ChapterInfo[];

export const CHAPTERS: ChapterInfo[] = __CHAPTERS__;
