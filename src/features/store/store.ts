import { Store as EffectorStore, createApi, createEffect, createStore, sample } from "effector";

import { DB, Loader, Note, Paragraph } from "..";

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

export type Actions = {
    init: () => void;
    selectNote: (noteId: Note.T["id"]) => void;
    addNote: (newNote: Note.T) => void;
    addParagraph: (newParagraph: Paragraph.T) => void;
};

export function make(
    noteService: DB.Service<Note.T>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
): [EffectorStore<T>, Actions] {
    const app$ = createStore(EMPTY);

    const api = createApi(app$, {
        init: (): T =>
            EMPTY,
        notesLoaded: (_, { items, selected }: { items: Note.T[], selected: Note.T["id"] }): T => ({
            notes: Loader.loaded({ items, selected }),
            paragraphs: Loader.loading(),
        }),
        paragraphsLoaded: (root, items: Paragraph.T[]) =>
            Loader.isLoaded(root.notes)
                ? ({
                    notes: root.notes,
                    paragraphs: Loader.loaded({ items }),
                })
                : EMPTY,
        selectNote: (root, newSelected: Note.T["id"]) =>
            Loader.isLoaded(root.notes) && root.notes.data.selected !== newSelected
                ? { ...root, notes: Loader.loaded({ items: root.notes.data.items, selected: newSelected })}
                : root,
        addNote: (root, newNote: Note.T) => {
            const loadedNotes: Notes = Loader.getWithDefault(root.notes, { items: [], selected: Note.UNSORTED.id });
            const notes: Notes = {
                items: loadedNotes.items.concat(newNote),
                selected: newNote.id,
            };

            return { notes: Loader.loaded(notes), paragraphs: Loader.loading() };
        },
        addParagraph: (root, newParagraph: Paragraph.T) => {
            if (Loader.isLoading(root.notes) || Loader.isLoading(root.paragraphs)) {
                return root;
            }

            return {
                notes: root.notes,
                paragraphs: Loader.loaded({ items: root.paragraphs.data.items.concat(newParagraph) }),
            }
        }
    });

    // -- Effects --
    initialLoadFX();
    addNoteFX();
    addParagraphFX();
    selectNoteFX();

    return [app$, api];

    function initialLoadFX() {
        return sample({
            clock: api.init,
            source: app$,
            target: createEffect(async () => {
                const notes = await noteService.getAll();
                api.notesLoaded({ items: notes, selected: Note.UNSORTED.id });
                const paragraphs = await paragraphService.getByParentId(Note.UNSORTED.id);
                api.paragraphsLoaded(paragraphs);
            }),
        });
    }

    function addNoteFX() {
        return sample({
            clock: api.addNote,
            target: createEffect(async (newNote: Note.T) => {
                await noteService.set(newNote);
                const newNotes = await noteService.getAll();
                api.notesLoaded({ items: newNotes, selected: newNote.id });
                const newParagraphs = await paragraphService.getByParentId(newNote.id);
                api.paragraphsLoaded(newParagraphs);
            }),
        });
    }

    function addParagraphFX() {
        return sample({
            clock: api.addParagraph,
            source: app$.map(state => Loader.getWithDefault(state.notes, { items: [], selected: Note.UNSORTED.id }).selected ),
            fn: (noteId, newParagraph) => ({ newParagraph, noteId }),
            target: createEffect(async ({ newParagraph, noteId }: { newParagraph: Paragraph.T, noteId: Note.T["id"]} ) => {
                paragraphService.set(newParagraph);
                const newParagraphs = await paragraphService.getByParentId(noteId);
                api.paragraphsLoaded(newParagraphs);
            }),
        })
    }

    function selectNoteFX() {
        return sample({
            clock: api.selectNote,
            target: createEffect(async (noteId: Note.T["id"]) => {
                const paragraphs = await paragraphService.getByParentId(noteId);
                api.paragraphsLoaded(paragraphs);
            }),
        })
    }
}
