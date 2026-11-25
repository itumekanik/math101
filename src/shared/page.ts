export interface TabSpec {
  tab: string;
  panel: string;
  hash: string;
}

export const TABS: Record<string, TabSpec> = {};

export interface PageHooks {
  glossaryIsOpen?: () => boolean;
  syncGlossary?: (state: { glossary?: boolean; term?: string }) => void;
}

export const hooks: PageHooks = {};
