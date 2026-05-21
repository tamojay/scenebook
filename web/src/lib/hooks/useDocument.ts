import { useEffect, useRef, useState } from "react";
import { documentsApi } from "@/lib/api/documents";
import { projectsApi } from "@/lib/api/projects";
import type { ScreenplayDocument } from "@/editor/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 1500;

const EMPTY_DOC: ScreenplayDocument = [
  { type: "action", children: [{ text: "" }] },
];

export function useDocument(projectId: string | undefined) {
  const [initialValue, setInitialValue] = useState<ScreenplayDocument | null>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingValueRef = useRef<ScreenplayDocument | null>(null);

  // Load on mount or when projectId changes
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    documentsApi.getByProjectId(projectId).then((doc) => {
      if (cancelled) return;
      const content =
        (doc?.contentJson as ScreenplayDocument | undefined) ?? EMPTY_DOC;
      setInitialValue(content);
    });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  // Save handler — debounced
  const scheduleSave = (value: ScreenplayDocument) => {
    if (!projectId) return;
    pendingValueRef.current = value;
    setSaveStatus("saving");

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const toSave = pendingValueRef.current;
      if (!toSave) return;
      try {
        await documentsApi.upsert(projectId, toSave);
        // Also bump the project's updatedAt so the dashboard reflects activity
        await projectsApi.update(projectId, {});
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DELAY_MS);
  };

  // Flush on unmount (don't lose the last change)
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      const toSave = pendingValueRef.current;
      if (toSave && projectId) {
        documentsApi.upsert(projectId, toSave);
      }
    };
  }, [projectId]);

  return {
    initialValue, // null = still loading
    saveStatus,
    onChange: scheduleSave,
  };
}
