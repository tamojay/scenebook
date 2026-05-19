import Dexie, { type Table } from "dexie";
import type { Project, Document } from "./types";

class ScenebookDB extends Dexie {
  projects!: Table<Project, string>;
  documents!: Table<Document, string>;

  constructor() {
    super("scenebook");
    this.version(1).stores({
      projects: "id, userId, updatedAt",
      documents: "id, projectId, updatedAt",
    });
  }
}

export const db = new ScenebookDB();
