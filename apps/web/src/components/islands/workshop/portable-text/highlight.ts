/**
 * Client-side code highlighting for workshop code blocks.
 *
 * Shiki's core with only the grammars @sanity/code-input offers (and their
 * aliases), plus the JavaScript regex engine instead of Oniguruma WASM.
 * `import('shiki')` would emit a chunk for all ~230 bundled languages and the
 * WASM engine; this keeps the build to the dozen grammars editors can pick.
 * Anything else renders as plain text. Ruby is left out on purpose: its grammar
 * embeds a dozen others and weighs ~900 kB.
 */
import type { HighlighterCore, LanguageInput } from 'shiki/core';

const GRAMMARS: Record<string, () => LanguageInput> = {
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  sass: () => import('shiki/langs/sass.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  shellscript: () => import('shiki/langs/shellscript.mjs'),
  bat: () => import('shiki/langs/bat.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  graphql: () => import('shiki/langs/graphql.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  xml: () => import('shiki/langs/xml.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  java: () => import('shiki/langs/java.mjs'),
};

/** code-input values and common spellings → the grammar that renders them. */
const ALIASES: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  mts: 'typescript',
  md: 'markdown',
  sh: 'shellscript',
  bash: 'shellscript',
  shell: 'shellscript',
  zsh: 'shellscript',
  batchfile: 'bat',
  mysql: 'sql',
  yml: 'yaml',
  py: 'python',
  gql: 'graphql',
};

export const THEME = 'github-dark';

/** The grammar for a code block's language, or null to render plain text. */
export function grammarFor(language: string | undefined): string | null {
  const key = (language ?? '').trim().toLowerCase();
  const name = ALIASES[key] ?? key;
  return name in GRAMMARS ? name : null;
}

let highlighter: Promise<HighlighterCore> | undefined;

/** Highlight `code` as HTML. Grammars load on first use; unknown languages render as plain text. */
export async function highlight(code: string, language: string | undefined): Promise<string> {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({ themes: [import('shiki/themes/github-dark.mjs')], langs: [], engine: createJavaScriptRegexEngine() }),
  );
  const h = await highlighter;
  const lang = grammarFor(language);
  if (lang && !h.getLoadedLanguages().includes(lang)) await h.loadLanguage(GRAMMARS[lang]());
  return h.codeToHtml(code, { lang: lang ?? 'text', theme: THEME });
}
