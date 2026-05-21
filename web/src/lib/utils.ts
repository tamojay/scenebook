import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Trigger a browser download for a text file.
 */
export function downloadText(
  filename: string,
  content: string,
  mimeType = "text/plain",
) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Sanitize a string for use as a filename.
 */
export function safeFilename(name: string): string {
  return (
    name
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 100) || "untitled"
  );
}
