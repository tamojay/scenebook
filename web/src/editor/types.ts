import type { BaseEditor, Descendant } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

// ─── Element types ───────────────────────────────────────────────

export type ElementType =
  | "scene_heading"
  | "action"
  | "character"
  | "parenthetical"
  | "dialogue"
  | "transition"
  | "shot";

export interface SceneHeadingElement {
  type: "scene_heading";
  children: CustomText[];
}

export interface ActionElement {
  type: "action";
  children: CustomText[];
}

export interface CharacterElement {
  type: "character";
  children: CustomText[];
}

export interface ParentheticalElement {
  type: "parenthetical";
  children: CustomText[];
}

export interface DialogueElement {
  type: "dialogue";
  children: CustomText[];
}

export interface TransitionElement {
  type: "transition";
  children: CustomText[];
}

export interface ShotElement {
  type: "shot";
  children: CustomText[];
}

export type ScreenplayElement =
  | SceneHeadingElement
  | ActionElement
  | CharacterElement
  | ParentheticalElement
  | DialogueElement
  | TransitionElement
  | ShotElement;

// ─── Text ────────────────────────────────────────────────────────

export interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// ─── Editor type augmentation ────────────────────────────────────

export type ScreenplayEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: ScreenplayEditor;
    Element: ScreenplayElement;
    Text: CustomText;
  }
}

// ─── Document type ───────────────────────────────────────────────

export type ScreenplayDocument = Descendant[];
