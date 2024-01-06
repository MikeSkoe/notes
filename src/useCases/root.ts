import { Loader, Note, Paragraph, History } from "..";

export type T = {
    notes: Note.T[];
    selected: History.T<{
        noteId: Note.T["id"],
        paragraphs: Paragraph.T[],
    }>;
};

export type Page = History.Unwrap<T["selected"]>;

export type Root = Loader.T<T>;

export const EMPTY: Root = Loader.loading();

export interface Actions {
    init: () => void;
    selectNote: (_: [Note.T["id"], boolean]) => void;
    addNote: (_: string) => void;
    addParagraph: (_: string) => void;
    deleteParagraph: (_: Paragraph.T["id"]) => void;
    linkParagraphToNote: (_: [Paragraph.T["id"], Note.T["id"]]) => void;
    back: (_: void) => void;
    front: (_: void) => void;
}

