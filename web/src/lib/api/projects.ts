import { db } from "@/lib/db/client";
import type { Project, ProjectFormat } from "@/lib/db/types";

export interface CreateProjectInput {
  title: string;
  format: ProjectFormat;
  userId: string;
}

export interface UpdateProjectInput {
  title?: string;
  format?: ProjectFormat;
}

export const projectsApi = {
  async list(userId: string): Promise<Project[]> {
    return db.projects
      .where("userId")
      .equals(userId)
      .reverse()
      .sortBy("updatedAt");
  },

  async get(id: string): Promise<Project | undefined> {
    return db.projects.get(id);
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      userId: input.userId,
      title: input.title,
      format: input.format,
      createdAt: now,
      updatedAt: now,
    };
    await db.projects.add(project);
    return project;
  },

  async update(id: string, input: UpdateProjectInput): Promise<void> {
    await db.projects.update(id, {
      ...input,
      updatedAt: new Date().toISOString(),
    });
  },

  async duplicate(id: string): Promise<Project | null> {
    const existing = await db.projects.get(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const copy: Project = {
      ...existing,
      id: crypto.randomUUID(),
      title: `${existing.title} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    await db.projects.add(copy);
    return copy;
  },

  async delete(id: string): Promise<void> {
    await db.projects.delete(id);
    // Also delete the document tied to this project
    await db.documents.where("projectId").equals(id).delete();
  },
};
