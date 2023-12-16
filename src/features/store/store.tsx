import { Store as EffectorStore, createEffect, createStore } from "effector";

import { DB, Loader, Note, Paragraph } from "..";

export type T = {
    notes: Loader.T<Note.T[]>,
    paragraphs: Loader.T<Paragraph.T[]>,
    selectedNoteId: Note.T["id"],
};

export const EMPTY: T = {
    notes: Loader.loading<Note.T[]>(),
    paragraphs: Loader.loading<Paragraph.T[]>(),
    selectedNoteId: Note.EMPTY.id,
};

export type Actions = {
    loadNotes: () => void;
    loadParagraphs: (noteId: Note.T["id"]) => void;
}

export function make(
    noteService: DB.Service<Note.T>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
): [EffectorStore<T>, Actions] {
    const loadNotes = createEffect<void, Note.T[]>(
        () => noteService.getAll());

    const loadParagraphs = createEffect<Note.T["id"], Paragraph.T[]>(
        noteId => paragraphService.getByParentId(noteId));

    const store = createStore<T>(EMPTY)
        .on(loadNotes.done, (root, { result: notes }) => ({
            ...root,
            selectedNoteId: notes[0]?.id ?? root.selectedNoteId,
            notes: Loader.loaded(notes),
        }))
        .on(loadParagraphs.done, (root, { result: paragraphs }) => ({
            ...root,
            paragraphs: Loader.loaded(paragraphs),
        }));
    
    return [store, { loadNotes, loadParagraphs }];
}
