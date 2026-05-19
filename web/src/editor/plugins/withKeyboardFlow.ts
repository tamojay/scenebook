import { Editor, Transforms, Element as SlateElement, Range } from "slate";
import type { ScreenplayEditor, ElementType } from "../types";

/**
 * Get the currently selected block's type and whether it's empty.
 */
function currentBlock(editor: ScreenplayEditor): {
  type: ElementType | null;
  isEmpty: boolean;
} {
  const [match] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  });
  if (!match) return { type: null, isEmpty: true };
  const [node] = match;
  if (!SlateElement.isElement(node)) return { type: null, isEmpty: true };
  const text = Editor.string(editor, match[1]);
  return { type: node.type, isEmpty: text.length === 0 };
}

/**
 * Change the type of the current block (no new line, in-place).
 */
function changeCurrentType(editor: ScreenplayEditor, type: ElementType) {
  Transforms.setNodes<SlateElement>(
    editor,
    { type },
    { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) },
  );
}

/**
 * Insert a new block of the given type after the current one.
 */
function insertBlockAfter(editor: ScreenplayEditor, type: ElementType) {
  Transforms.insertNodes(editor, {
    type,
    children: [{ text: "" }],
  } as SlateElement);
}

/**
 * Plugin: handle Tab and Enter for screenplay element flow.
 */
export function withKeyboardFlow(editor: ScreenplayEditor): ScreenplayEditor {
  const { insertBreak } = editor;

  // Override Enter
  editor.insertBreak = () => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      insertBreak();
      return;
    }

    const { type, isEmpty } = currentBlock(editor);

    switch (type) {
      case "scene_heading":
        // After a scene heading, always go to action
        insertBlockAfter(editor, "action");
        return;

      case "character":
        // After character, go to dialogue
        insertBlockAfter(editor, "dialogue");
        return;

      case "parenthetical":
        // After parenthetical, go to dialogue
        insertBlockAfter(editor, "dialogue");
        return;

      case "dialogue":
        if (isEmpty) {
          // Empty dialogue + Enter = exit to action
          changeCurrentType(editor, "action");
          return;
        }
        // Otherwise, new dialogue line (could revisit later)
        insertBlockAfter(editor, "action");
        return;

      case "transition":
        // After transition, go to scene heading
        insertBlockAfter(editor, "scene_heading");
        return;

      default:
        // action, shot, or unknown: fall through to default Enter
        insertBreak();
    }
  };

  return editor;
}

/**
 * Handle Tab key. Called from the Editable's onKeyDown.
 * Returns true if the event was handled (caller should preventDefault).
 */
export function handleTab(
  editor: ScreenplayEditor,
  shiftKey: boolean,
): boolean {
  if (!editor.selection) return false;

  const { type } = currentBlock(editor);

  // Forward cycles
  if (!shiftKey) {
    switch (type) {
      case "action":
        changeCurrentType(editor, "character");
        return true;
      case "character":
        changeCurrentType(editor, "transition");
        return true;
      case "transition":
        changeCurrentType(editor, "scene_heading");
        return true;
      case "scene_heading":
        changeCurrentType(editor, "action");
        return true;
      case "dialogue":
        changeCurrentType(editor, "parenthetical");
        return true;
      case "parenthetical":
        changeCurrentType(editor, "dialogue");
        return true;
    }
  }

  // Shift+Tab: reverse cycle
  if (shiftKey) {
    switch (type) {
      case "character":
        changeCurrentType(editor, "action");
        return true;
      case "transition":
        changeCurrentType(editor, "character");
        return true;
      case "scene_heading":
        changeCurrentType(editor, "transition");
        return true;
      case "action":
        changeCurrentType(editor, "scene_heading");
        return true;
      case "parenthetical":
        changeCurrentType(editor, "dialogue");
        return true;
      case "dialogue":
        changeCurrentType(editor, "parenthetical");
        return true;
    }
  }

  return false;
}
