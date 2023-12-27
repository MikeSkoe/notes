import { EventCallable } from "effector";

import { Loader, Note, Paragraph } from "..";

export type T = {
    notes: Note.T[];
    selected: Note.T["id"];
    paragraphs: Paragraph.T[];
};

export type Root = Loader.T<T>;

export const EMPTY: Root = Loader.loading();

export interface Actions {
    init: EventCallable<void>;
    loaded: EventCallable<T>;
    paragraphsLoaded: EventCallable<Paragraph.T[]>;
    selectNote: EventCallable<Note.T["id"]>;
    addNewNote: EventCallable<string>;
    addNote: EventCallable<Note.T>;
    addNewParagraph: EventCallable<string>;
    addParagraph: EventCallable<Paragraph.T>;
    deleteParagraph: EventCallable<Paragraph.T["id"]>;
    linkParagraphToNote: EventCallable<[Paragraph.T["id"], Note.T["id"]]>;
}
