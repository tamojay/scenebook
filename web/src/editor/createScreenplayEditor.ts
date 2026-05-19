import { createEditor } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import type { ScreenplayEditor } from "./types";

export function createScreenplayEditor(): ScreenplayEditor {
  return withHistory(withReact(createEditor()));
}
