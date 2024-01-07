import { Loader, Note, Paragraph, History } from "..";

export type Root = Loader.T<{
    notes: Record<Note.T["id"], Note.T>;
    paragraphs: Record<Paragraph.T["id"], Paragraph.T>;
    history: History.T<Note.T["id"]>;
    notesParagraphs: Record<Note.T["id"], Paragraph.T["id"][]>;
}>;

export const EMPTY: Root = Loader.loading();
