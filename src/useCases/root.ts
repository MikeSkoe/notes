import { EventCallable } from "effector";

import { Loader, Note, Paragraph } from "..";

export type Notes = { items: Note.T[], selected: Note.T["id"] };
export type Paragraphs = { items: Paragraph.T[] };
export type Root =
    | { notes: Loader.Loading<Notes>; paragraphs: Loader.Loading<Paragraphs> }
    | { notes: Loader.Loaded<Notes>; paragraphs: Loader.Loading<Paragraphs> }
    | { notes: Loader.Loaded<Notes>; paragraphs: Loader.Loaded<Paragraphs> }

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
}
