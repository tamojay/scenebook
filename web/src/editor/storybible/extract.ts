import type { ScreenplayDocument, ScreenplayElement } from "../types";

export interface ExtractedCharacter {
  name: string;
  appearances: number;
  firstAppearanceIndex: number; // index into the document
}

export interface ExtractedLocation {
  name: string;
  intExt: "INT" | "EXT" | "INT/EXT" | "OTHER";
  appearances: number;
  firstAppearanceIndex: number;
}

export interface StoryBibleData {
  characters: ExtractedCharacter[];
  locations: ExtractedLocation[];
}

/**
 * Walk the Slate document and extract characters + locations.
 * Characters: from `character` element text.
 * Locations: parsed from scene_heading text (e.g., "INT. CAFE - DAY").
 */
export function extractStoryBible(doc: ScreenplayDocument): StoryBibleData {
  const characterMap = new Map<string, ExtractedCharacter>();
  const locationMap = new Map<string, ExtractedLocation>();

  for (let i = 0; i < doc.length; i++) {
    const node = doc[i] as ScreenplayElement;
    const text = getText(node).trim();

    if (!text) continue;

    if (node.type === "character") {
      // Strip extensions like (V.O.), (O.S.), (CONT'D) from cue
      const name = text.replace(/\s*\(.+\)\s*$/, "").toUpperCase();
      if (!name) continue;

      const existing = characterMap.get(name);
      if (existing) {
        existing.appearances += 1;
      } else {
        characterMap.set(name, {
          name,
          appearances: 1,
          firstAppearanceIndex: i,
        });
      }
    }

    if (node.type === "scene_heading") {
      const parsed = parseSceneHeading(text);
      if (!parsed) continue;

      const key = `${parsed.intExt}::${parsed.location}`;
      const existing = locationMap.get(key);
      if (existing) {
        existing.appearances += 1;
      } else {
        locationMap.set(key, {
          name: parsed.location,
          intExt: parsed.intExt,
          appearances: 1,
          firstAppearanceIndex: i,
        });
      }
    }
  }

  return {
    characters: Array.from(characterMap.values()).sort(
      (a, b) => b.appearances - a.appearances,
    ),
    locations: Array.from(locationMap.values()).sort(
      (a, b) => b.appearances - a.appearances,
    ),
  };
}

/**
 * Parse "INT. CAFE - DAY" → { intExt: 'INT', location: 'CAFE' }
 * Tolerant of varied formatting:
 *   - "INT. CAFE - DAY"
 *   - "EXT. PARK - NIGHT"
 *   - "INT/EXT. CAR - CONTINUOUS"
 *   - "INT CAFE DAY" (no dots)
 */
function parseSceneHeading(text: string): {
  intExt: "INT" | "EXT" | "INT/EXT" | "OTHER";
  location: string;
} | null {
  const upper = text.toUpperCase().trim();

  const match = upper.match(
    /^(INT\/EXT|I\/E|INT|EXT|EST)\.?\s+(.+?)(?:\s*-\s*(.+))?$/,
  );

  if (!match) {
    // Couldn't parse — treat the whole heading as a location
    return { intExt: "OTHER", location: upper };
  }

  const prefix = match[1];
  const location = match[2].trim();

  let intExt: "INT" | "EXT" | "INT/EXT" | "OTHER";
  if (prefix === "INT") intExt = "INT";
  else if (prefix === "EXT") intExt = "EXT";
  else if (prefix === "INT/EXT" || prefix === "I/E") intExt = "INT/EXT";
  else intExt = "OTHER";

  return { intExt, location };
}

function getText(node: ScreenplayElement): string {
  return node.children.map((c) => c.text).join("");
}
