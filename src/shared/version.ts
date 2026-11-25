import { I18N, L } from "./i18n.js";

export interface Release {
  version: string;
  date: string;
  commit: string | null;
  repo: string | null;
}

declare const __RELEASE__: Release;

export const RELEASE: Release = __RELEASE__;
export const REPO: string = RELEASE.repo ?? "https://github.com/itumekanik/math101";
export const CHANGELOG_URL: string = `${REPO}/blob/main/CHANGELOG.md`;

export function releaseDate(): string {
  return new Intl.DateTimeFormat(I18N.lang === "en" ? "en-GB" : "tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${RELEASE.date}T00:00:00Z`));
}

export function versionLine(className: string, { full = false } = {}): HTMLElement {
  const line = document.createElement("p");
  line.className = className;
  const build = RELEASE.commit ? `${L({ tr: "derleme", en: "build" })} ${RELEASE.commit}` : null;
  const version = document.createElement("span");
  version.className = "version-num";
  version.textContent = `${L({ tr: "Sürüm", en: "Version" })} ${RELEASE.version}`;
  const parts: (string | null)[] = full ? [releaseDate(), build] : [];
  if (!full) line.title = [releaseDate(), build].filter(Boolean).join(" · ");
  line.append(version, ...parts.filter((p): p is string => p !== null).map((p) => ` · ${p}`));
  if (CHANGELOG_URL) {
    const changes = document.createElement("a");
    changes.href = CHANGELOG_URL;
    changes.target = "_blank";
    changes.rel = "noopener";
    changes.textContent = L({ tr: "Neler değişti?", en: "What's new?" });
    line.append(" · ", changes);
  }
  return line;
}
