import type { ScreenplayDocument, ScreenplayElement } from "../types";

/**
 * Estimate page count from a Slate document.
 *
 * Industry rule of thumb: 1 page ≈ 55 lines of Courier 12pt.
 * This is a rough approximation. Real pagination needs full
 * line-wrap measurement (deferred to the production PDF engine).
 *
 * For each element, we estimate how many lines it occupies based
 * on element-specific wrap widths.
 */

const LINES_PER_PAGE = 55;

// Approximate wrap widths (characters per line) by element type
const WRAP_WIDTHS: Record<string, number> = {
  scene_heading: 58,
  action: 58,
  character: 38,
  parenthetical: 17,
  dialogue: 35,
  transition: 58,
  shot: 58,
};

// Vertical spacing (additional lines after this element)
const TRAILING_LINES: Record<string, number> = {
  scene_heading: 2, // extra space before next scene
  action: 1,
  character: 0, // tight against dialogue
  parenthetical: 0,
  dialogue: 1,
  transition: 2,
  shot: 1,
};

export function estimatePageCount(doc: ScreenplayDocument): number {
  let totalLines = 0;

  for (const rawNode of doc) {
    const node = rawNode as ScreenplayElement;
    const text = node.children.map((c) => c.text).join("");
    const wrap = WRAP_WIDTHS[node.type] ?? 58;
    const trailing = TRAILING_LINES[node.type] ?? 1;

    // Empty blocks still take ~1 line (blank space)
    if (!text.trim()) {
      totalLines += 1;
      continue;
    }

    // Approximate wrapped lines
    const lineCount = Math.max(1, Math.ceil(text.length / wrap));
    totalLines += lineCount + trailing;
  }

  return Math.max(1, totalLines / LINES_PER_PAGE);
}
