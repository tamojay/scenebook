import { Editor, Transforms, Element as SlateElement } from "slate";
import type { ScreenplayEditor, ElementType } from "./types";

/**
 * Change the type of the currently selected block.
 */
export function setBlockType(editor: ScreenplayEditor, type: ElementType) {
  Transforms.setNodes<SlateElement>(
    editor,
    { type },
    { match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n) },
  );
}

/**
 * Get the type of the currently selected block (returns null if none).
 */
export function getCurrentBlockType(
  editor: ScreenplayEditor,
): ElementType | null {
  const [match] = Editor.nodes(editor, {
    match: (n) => SlateElement.isElement(n) && Editor.isBlock(editor, n),
  });
  if (!match) return null;
  const [node] = match;
  return SlateElement.isElement(node) ? node.type : null;
}
