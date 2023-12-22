import { EventCallable, createApi, createStore } from "effector";

import { DB, Loader, Note, Paragraph } from "..";
import { init, deleteParagraph, selectNote, addNote, addParagraph } from "./useCases";

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
    addNote: EventCallable<Note.T>;
    addParagraph: EventCallable<Paragraph.T>;
    deleteParagraph: EventCallable<Paragraph.T["id"]>;
}

export function make(
    noteService: DB.Service<Note.T>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
) {
    const app$ = createStore(EMPTY);
    const api = createApi(app$, {
        init: init.action,
        notesLoaded: init.notesLoaded,
        paragraphsLoaded: init.paragraphsLoaded,
        selectNote: selectNote.action,
        addNote: addNote.action,
        addParagraph: addParagraph.action,
        deleteParagraph: deleteParagraph.action,
    });

    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state.notes, ({ selected }) => selected),
            Note.UNSORTED.id,
        ),
    );

    init.FX(api, noteService, paragraphService);
    addNote.FX(api, noteService, paragraphService);
    addParagraph.FX(api, selectedNote$, paragraphService);
    selectNote.FX(api, paragraphService);
    deleteParagraph.FX(api, selectedNote$, paragraphService);

    return [app$, api] as const;
}
