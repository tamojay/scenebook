import { Editor, Transforms, Element as SlateElement, Range } from "slate";
import type { ScreenplayEditor, ElementType } from "../types";

// Scene heading triggers — must be followed by a space to convert
const SCENE_HEADING_TRIGGERS = ["INT.", "EXT.", "INT/EXT.", "I/E.", "EST."];

// Transition triggers — text that ends with these phrases becomes transition.
// Detection happens on Enter (line completion), not space.
const TRANSITION_SUFFIXES = [
  "CUT TO:",
  "FADE TO:",
  "DISSOLVE TO:",
  "SMASH CUT TO:",
  "MATCH CUT TO:",
  "JUMP CUT TO:",
  "TIME CUT TO:",
  "FADE IN:",
  "FADE IN.",
  "FADE OUT.",
  "FADE OUT:",
  "THE END.",
];

export function withAutoFormat(editor: ScreenplayEditor): ScreenplayEditor {
  const { insertText, insertBreak } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    if (text !== " " || !selection || !Range.isCollapsed(selection)) {
      insertText(text);
      return;
    }

    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    });
    if (!match) {
      insertText(text);
      return;
    }
    const [node, path] = match;

    if (!SlateElement.isElement(node) || node.type !== "action") {
      insertText(text);
      return;
    }

    const blockStart = Editor.start(editor, path);
    const range = { anchor: blockStart, focus: selection.anchor };
    const beforeText = Editor.string(editor, range).toUpperCase();

    if (SCENE_HEADING_TRIGGERS.includes(beforeText)) {
      Transforms.setNodes<SlateElement>(
        editor,
        { type: "scene_heading" as ElementType },
        {
          match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        },
      );
    }

    insertText(text);
  };

  // Detect transitions when the user presses Enter
  editor.insertBreak = () => {
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      insertBreak();
      return;
    }

    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    });

    if (match) {
      const [node, path] = match;
      if (SlateElement.isElement(node) && node.type === "action") {
        const text = Editor.string(editor, path).trim().toUpperCase();
        if (TRANSITION_SUFFIXES.some((s) => text === s || text.endsWith(s))) {
          // Convert this block to a transition
          Transforms.setNodes<SlateElement>(
            editor,
            { type: "transition" as ElementType },
            {
              match: (n) =>
                SlateElement.isElement(n) && Editor.isBlock(editor, n),
            },
          );
        }
      }
    }

    insertBreak();
  };

  return editor;
}
