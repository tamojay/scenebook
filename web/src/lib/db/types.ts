export type ProjectFormat = "feature" | "tv_hour" | "tv_half" | "short";

export interface Project {
  id: string;
  userId: string;
  title: string;
  format: ProjectFormat;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  contentJson: unknown; // Slate document — we'll type this properly later
  updatedAt: string;
}
