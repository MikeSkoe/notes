import { createEffect, createEvent } from "effector";

import { Service, Note, Paragraph, Loader, History } from "..";

import { Root } from "./root";

// Initialize the application

// --- Events ---

export const initialLoaded = createEvent<[Note.T["id"], Note.T[], Paragraph.T[]]>();
export const pageLoaded = createEvent<[Note.T["id"], Paragraph.T[]]>();

// --- Reducers ---

export function onInitalLoaded(
    _: Root,
    [noteId, notes, paragraphs]: [Note.T["id"], Note.T[], Paragraph.T[]],
): Root {
    return Loader.loaded({
        notes,
        history: History.make(noteId),
        notesParagraphs: {
            [noteId]: paragraphs,
        },
    });
};

export function onPageLoaded(
    root: Root,
    [noteId, paragraphs]: [Note.T["id"], Paragraph.T[]],
): Root {
    return Loader.map(root, state => ({
        notes: state.notes,
        history: History.add(state.history, noteId),
        notesParagraphs: {
            ...state.notesParagraphs,
            [noteId]: paragraphs,
        }
    }));
}

// --- FXs ---

export function initFX(
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return createEffect(async () => {
        const [notes, paragraphs] = await Promise.all([
            noteService.getAll(),
            paragraphService.getByParentId(Note.UNSORTED.id),
        ]);

        initialLoaded([Note.UNSORTED.id, notes, paragraphs]);
    });
}
