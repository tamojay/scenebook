import { useMemo, useState, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import type { ScreenplayDocument } from "./types";
import { renderElement } from "./renderElement";
import { EditorToolbar } from "./EditorToolbar";
import { withKeyboardFlow, handleTab } from "./plugins/withKeyboardFlow";
import { withAutoFormat } from "./plugins/withAutoFormat";
import "./screenplay.css";

interface ScreenplayEditorProps {
  initialValue?: ScreenplayDocument;
  onChange?: (value: ScreenplayDocument) => void;
}

const DEFAULT_VALUE: ScreenplayDocument = [
  { type: "action", children: [{ text: "" }] },
];

export function ScreenplayEditor({
  initialValue = DEFAULT_VALUE,
  onChange,
}: ScreenplayEditorProps) {
  const editor = useMemo(
    () =>
      withAutoFormat(withKeyboardFlow(withHistory(withReact(createEditor())))),
    [],
  );
  const [value, setValue] = useState<ScreenplayDocument>(initialValue);

  const handleChange = useCallback(
    (newValue: ScreenplayDocument) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <Slate editor={editor} initialValue={value} onChange={handleChange}>
      <div className="screenplay-canvas">
        <div className="w-full max-w-[8.5in] flex flex-col">
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
    </Slate>
  );
}
