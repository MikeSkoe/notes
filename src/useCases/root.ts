import { EventCallable } from "effector";

import { Loader, Note, Paragraph, Selected } from "..";

export type T = {
    notes: Note.T[];
    selected: Selected.T<{
        noteId: Note.T["id"],
        paragraphs: Paragraph.T[],
    }>;
};

export type Page = Selected.Unwrap<T["selected"]>;

export type Root = Loader.T<T>;

export const EMPTY: Root = Loader.loading();

export interface Actions {
    init: EventCallable<void>;
    selectNote: EventCallable<[Note.T["id"], boolean]>;
    addNote: EventCallable<string>;
    addParagraph: EventCallable<string>;
    deleteParagraph: EventCallable<Paragraph.T["id"]>;
    linkParagraphToNote: EventCallable<[Paragraph.T["id"], Note.T["id"]]>;
    back: EventCallable<void>;
    front: EventCallable<void>;
}
