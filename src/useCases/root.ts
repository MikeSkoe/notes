import { EventCallable } from "effector";

import { Loader, Note, Paragraph } from "..";

export type Notes = { items: Note.T[], selected: Note.T["id"] };
export type Paragraphs = { items: Paragraph.T[] };
export type Root = {
    notes: Loader.T<Notes>;
    paragraphs: Loader.T<Paragraphs>;
}

export const EMPTY: Root = {
    notes: Loader.loading(),
    paragraphs: Loader.loading(),
};

export interface Actions {
    init: EventCallable<void>;
    notesLoaded: EventCallable<[Note.T["id"], Note.T[]]>;
    paragraphsLoaded: EventCallable<Paragraph.T[]>;
    selectNote: EventCallable<Note.T["id"]>;
    addNewNote: EventCallable<string>;
    addNote: EventCallable<Note.T>;
    addNewParagraph: EventCallable<string>;
    addParagraph: EventCallable<Paragraph.T>;
    deleteParagraph: EventCallable<Paragraph.T["id"]>;
    linkParagraphToNote: EventCallable<[Paragraph.T["id"], Note.T["id"]]>;
}
