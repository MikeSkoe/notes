import { EventCallable } from "effector";

import { Loader, Note, Paragraph } from "..";

export type Notes = { items: Note.T[], selected: Note.T["id"] };
export type Paragraphs = { items: Paragraph.T[] };
export type T =
    | { notes: Loader.Loading<Notes>; paragraphs: Loader.Loading<Paragraphs> }
    | { notes: Loader.Loaded<Notes>; paragraphs: Loader.Loading<Paragraphs> }
    | { notes: Loader.Loaded<Notes>; paragraphs: Loader.Loaded<Paragraphs> }

export const EMPTY: T = {
    notes: Loader.loading(),
    paragraphs: Loader.loading(),
};

export interface Actions {
    init: EventCallable<void>;
    notesLoaded: EventCallable<[Note.T["id"], Note.T[]]>;
    paragraphsLoaded: EventCallable<Paragraph.T[]>;
    selectNote: EventCallable<Note.T["id"]>;
    addNote: EventCallable<Note.T>;
    addParagraph: EventCallable<Paragraph.T>;
    deleteParagraph: EventCallable<Paragraph.T["id"]>;
}
