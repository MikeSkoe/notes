import { EventCallable, createApi, createStore } from "effector";

import { DB, Loader, Note, Paragraph } from "..";
import { init, initialLoadFX, notesLoaded, paragraphsLoaded } from "./useCases/init";
import { deleteParagraph, deleteParagraphFX } from "./useCases/deleteParagraph";
import { selectNote, selectNoteFX } from "./useCases/selectNote";
import { addNote, addNoteFX } from "./useCases/addNote";
import { addParagraph, addParagraphFX } from "./useCases/addParagraph";

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
    const app$ = createStore(EMPTY, { skipVoid: true, updateFilter: (a, b) => a !== b });
    const api = createApi(app$, {
        init,
        notesLoaded,
        paragraphsLoaded,
        selectNote,
        addNote,
        addParagraph,
        deleteParagraph,
    });

    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state.notes, ({ selected }) => selected),
            Note.UNSORTED.id,
        ),
    );

    initialLoadFX(api, noteService, paragraphService);
    addNoteFX(api, noteService, paragraphService);
    addParagraphFX(api, selectedNote$, paragraphService);
    selectNoteFX(api, paragraphService);
    deleteParagraphFX(api, selectedNote$, paragraphService);

    return [app$, api] as const;
}
