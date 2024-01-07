import { Loader, Note, Paragraph, History } from "..";

export type Root = Loader.T<{
    notes: Note.T[];
    history: History.T<Note.T["id"]>;
    notesParagraphs: Record<Note.T["id"], Paragraph.T[]>;
}>;

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
