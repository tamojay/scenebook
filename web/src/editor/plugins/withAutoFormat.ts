import { Editor, Transforms, Element as SlateElement, Range } from "slate";
import type { ScreenplayEditor } from "../types";

// Patterns that trigger conversion to scene_heading.
// Match must be at the start of the line, followed by a space or end-of-line.
const SCENE_HEADING_TRIGGERS = ["INT.", "EXT.", "INT/EXT.", "I/E.", "EST."];

export function withAutoFormat(editor: ScreenplayEditor): ScreenplayEditor {
  const { insertText } = editor;

  editor.insertText = (text) => {
    const { selection } = editor;

    // Only fire on space — that's the natural "I've finished typing the prefix" signal
    if (text !== " " || !selection || !Range.isCollapsed(selection)) {
      insertText(text);
      return;
    }

    // Find the current block
    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    });
    if (!match) {
      insertText(text);
      return;
    }
    const [node, path] = match;

    // Only convert from action blocks (don't override deliberate choices)
    if (!SlateElement.isElement(node) || node.type !== "action") {
      insertText(text);
      return;
    }

    // Get the text from the start of the block to the cursor
    const blockStart = Editor.start(editor, path);
    const range = { anchor: blockStart, focus: selection.anchor };
    const beforeText = Editor.string(editor, range).toUpperCase();

    // Check if the text so far matches one of our triggers
    if (SCENE_HEADING_TRIGGERS.includes(beforeText)) {
      // Convert the block to scene_heading
      Transforms.setNodes<SlateElement>(
        editor,
        { type: "scene_heading" },
        {
          match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
        },
      );
    }

    // Insert the space normally so the user can keep typing
    insertText(text);
  };

  return editor;
}
