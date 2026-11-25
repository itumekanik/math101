import { setLang } from "./i18n.js";

export type ThemeChoice = "light" | "dark" | "system";

const systemDark = matchMedia("(prefers-color-scheme: dark)");

export const themeChoice = (): ThemeChoice =>
  (document.documentElement.dataset.theme as ThemeChoice | undefined) ?? "system";

function markThemeButtons(): void {
  for (const b of document.querySelectorAll<HTMLButtonElement>("#theme-switch button")) {
    b.setAttribute("aria-pressed", String(b.dataset.themeChoice === themeChoice()));
  }
}

export function applyTheme(choice: ThemeChoice): void {
  if (choice === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", choice);
  } catch {
    /* ignore storage failures */
  }
  markThemeButtons();
  document.dispatchEvent(new CustomEvent("theme-change"));
}

export function wireSwitches(): void {
  for (const b of document.querySelectorAll<HTMLButtonElement>("#theme-switch button")) {
    b.addEventListener("click", () => applyTheme(b.dataset.themeChoice as ThemeChoice));
  }
  systemDark.addEventListener("change", () => {
    if (themeChoice() === "system") document.dispatchEvent(new CustomEvent("theme-change"));
  });
  markThemeButtons();
  for (const b of document.querySelectorAll<HTMLButtonElement>("#lang-switch button")) {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  }
}
