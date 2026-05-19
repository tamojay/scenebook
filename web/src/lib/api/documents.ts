import { db } from "@/lib/db/client";
import type { Document } from "@/lib/db/types";

export const documentsApi = {
  async getByProjectId(projectId: string): Promise<Document | undefined> {
    const docs = await db.documents
      .where("projectId")
      .equals(projectId)
      .toArray();
    return docs[0];
  },

  async upsert(projectId: string, contentJson: unknown): Promise<Document> {
    const existing = await documentsApi.getByProjectId(projectId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: Document = {
        ...existing,
        contentJson,
        updatedAt: now,
      };
      await db.documents.put(updated);
      return updated;
    }

    const created: Document = {
      id: crypto.randomUUID(),
      projectId,
      contentJson,
      updatedAt: now,
    };
    await db.documents.add(created);
    return created;
  },
};
