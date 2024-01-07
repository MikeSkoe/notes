import { Loader, Note, Paragraph, History } from "..";

export type Root = Loader.T<{
    notes: Record<Note.T["id"], Note.T>;
    history: History.T<Note.T["id"]>;
    notesParagraphs: Record<Note.T["id"], Paragraph.T[]>;
}>;

export const EMPTY: Root = Loader.loading();
