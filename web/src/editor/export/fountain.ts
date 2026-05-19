import type { ScreenplayDocument, ScreenplayElement } from "../types";

/**
 * Convert a Slate screenplay document to Fountain format.
 * Fountain spec: https://fountain.io/syntax
 *
 * Fountain uses indentation + uppercase conventions rather than
 * explicit tags. The serializer walks each block and emits its
 * Fountain representation.
 */
export function toFountain(doc: ScreenplayDocument): string {
  const lines: string[] = [];

  for (let i = 0; i < doc.length; i++) {
    const node = doc[i] as ScreenplayElement;
    const prev = i > 0 ? (doc[i - 1] as ScreenplayElement) : null;
    const text = getText(node).trim();

    if (!text) {
      // Preserve blank lines as block separators
      lines.push("");
      continue;
    }

    switch (node.type) {
      case "scene_heading": {
        // Scene headings need a preceding blank line in Fountain
        if (prev && getText(prev).trim()) lines.push("");
        lines.push(text.toUpperCase());
        break;
      }

      case "action": {
        if (prev && prev.type !== "action") lines.push("");
        lines.push(text);
        break;
      }

      case "character": {
        lines.push("");
        lines.push(text.toUpperCase());
        break;
      }

      case "parenthetical": {
        const wrapped = text.startsWith("(")
          ? text
          : `(${text.replace(/^\(|\)$/g, "")})`;
        lines.push(wrapped);
        break;
      }

      case "dialogue": {
        lines.push(text);
        break;
      }

      case "transition": {
        if (prev && getText(prev).trim()) lines.push("");
        // Fountain auto-detects transitions if line is uppercase and
        // ends with "TO:". Force with leading ">" if needed.
        const upper = text.toUpperCase();
        if (upper.endsWith("TO:")) {
          lines.push(upper);
        } else {
          lines.push(`> ${upper}`);
        }
        break;
      }

      case "shot": {
        if (prev && getText(prev).trim()) lines.push("");
        // Fountain doesn't have a dedicated "shot" — treat as action
        // in uppercase (the common convention).
        lines.push(text.toUpperCase());
        break;
      }
    }
  }

  return lines.join("\n").trim() + "\n";
}

function getText(node: ScreenplayElement): string {
  return node.children.map((c) => c.text).join("");
}
