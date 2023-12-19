import { createApi, createStore } from "effector";

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

export function makeRootStore() {
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

    return [app$, api] as const;

    function deleteParagraph(root: Root, id: Paragraph.T["id"]): Root {
        if (Loader.isLoading(root.paragraphs) || Loader.isLoading(root.notes)) {
            return root;
        }

        return {
            notes: root.notes,
            paragraphs: Loader.loaded({
                items: root.paragraphs.data.items.filter(pr => pr.id !== id),
            }),
        };
    }

    function notesLoaded(_: Root, { items, selected }: { items: Note.T[], selected: Note.T["id"] }): Root {
        return ({
            notes: Loader.loaded({ items, selected }),
            paragraphs: Loader.loading(),
        });
    };

    function init(): Root {
        return EMPTY;
    }

    function paragraphsLoaded(root: Root, items: Paragraph.T[]): Root {
        if (!Loader.isLoaded(root.notes)) {
            return root;
        }

        return {
            notes: root.notes,
            paragraphs: Loader.loaded({ items }),
        };
    }

    function selectNote(root: Root, newSelected: Note.T["id"]): Root {
        if (!Loader.isLoaded(root.notes) || root.notes.data.selected === newSelected) {
            return root;
        }

        return {
            ...root,
            notes: Loader.loaded({
                items: root.notes.data.items,
                selected: newSelected,
            }),
        };
    }

    function addNote(root: Root, newNote: Note.T): Root {
        const loadedNotes: Notes = Loader.getWithDefault(root.notes, { items: [], selected: Note.UNSORTED.id });

        return {
            notes: Loader.loaded({
                items: loadedNotes.items.concat(newNote),
                selected: newNote.id,
            }),
            paragraphs: Loader.loading(),
        };
    }

    function addParagraph(root: Root, newParagraph: Paragraph.T): Root {
        if (Loader.isLoading(root.notes) || Loader.isLoading(root.paragraphs)) {
            return root;
        }

        return {
            notes: root.notes,
            paragraphs: Loader.loaded({
                items: root.paragraphs.data.items.concat(newParagraph),
            }),
        };
    }
}