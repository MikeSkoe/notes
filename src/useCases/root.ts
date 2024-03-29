import { Loader, Note, Paragraph, History, Option } from "..";

export type Root = Loader.T<{
    notes: Record<Note.T["id"], Note.T>;
    paragraphs: Record<Paragraph.T["id"], Paragraph.T>;
    history: History.T<Note.T["id"]>;
    editParagraph: Option.T<Paragraph.T["id"]>;
}>;

export const EMPTY: Root = Loader.loading();
