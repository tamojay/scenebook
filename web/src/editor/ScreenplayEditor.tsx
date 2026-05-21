import { useMemo, useState, useCallback, useEffect } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import type { ScreenplayDocument } from "./types";
import { renderElement } from "./renderElement";
import { EditorToolbar } from "./EditorToolbar";
import { withKeyboardFlow, handleTab } from "./plugins/withKeyboardFlow";
import { withAutoFormat } from "./plugins/withAutoFormat";
import "./screenplay.css";
import { EditorStatusBar } from "./EditorStatusBar";

interface ScreenplayEditorProps {
  initialValue?: ScreenplayDocument;
  onChange?: (value: ScreenplayDocument) => void;
  jumpToIndex?: number | null;
}

const DEFAULT_VALUE: ScreenplayDocument = [
  { type: "action", children: [{ text: "" }] },
];

export function ScreenplayEditor({
  initialValue = DEFAULT_VALUE,
  onChange,
  jumpToIndex,
}: ScreenplayEditorProps) {
  const editor = useMemo(
    () =>
      withAutoFormat(withKeyboardFlow(withHistory(withReact(createEditor())))),
    [],
  );
  const [value, setValue] = useState<ScreenplayDocument>(initialValue);

  useEffect(() => {
    if (jumpToIndex == null) return;

    try {
      // Move selection to the start of the target block
      const point = { path: [jumpToIndex, 0], offset: 0 };
      Transforms.select(editor, point);

      // Focus the editor and scroll the node into view
      ReactEditor.focus(editor);
      const domNode = ReactEditor.toDOMNode(
        editor,
        editor.children[jumpToIndex],
      );
      domNode.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      // Index out of range or stale — silently ignore
    }
  }, [jumpToIndex, editor]);

  const handleChange = useCallback(
    (newValue: ScreenplayDocument) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <Slate editor={editor} initialValue={value} onChange={handleChange}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto screenplay-canvas">
          <div className="w-full max-w-[8.5in] mx-auto flex flex-col">
            <EditorToolbar />
            <div className="screenplay-page">
              <Editable
                renderElement={renderElement}
                placeholder="FADE IN:"
                className="outline-none min-h-100"
                spellCheck
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    const handled = handleTab(editor, event.shiftKey);
                    if (handled) event.preventDefault();
                  }
                }}
              />
            </div>
          </div>
        </div>
        <EditorStatusBar />
      </div>
    </Slate>
  );
}
