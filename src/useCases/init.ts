import { createEffect, createEvent, sample, Store } from "effector";

import { Service, Note, Paragraph, Loader, History } from "..";

import { Root } from "./root";

// Initialize the application

export const init = createEvent();
export const initialLoaded = createEvent<[Note.T["id"], Note.T[], Paragraph.T[]]>();
export const pageLoaded = createEvent<[Note.T["id"], Paragraph.T[]]>();

export function onLoaded(
    store: Store<Root>,
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    store.on(initialLoaded, initialLoadedReducer);
    store.on(pageLoaded, pageLoadedReducer);

    sample({
        clock: init,
        target: createEffect(effect),
    });

    function initialLoadedReducer(
        _: Root,
        [noteId, notes, paragraphs]: [Note.T["id"], Note.T[], Paragraph.T[]],
    ): Root {
        return Loader.loaded({
            notes: notes.reduce(
                (acc, note) => ({ ...acc, [note.id]: note }),
                {} as Record<Note.T["id"], Note.T>,
            ),
            history: History.make(noteId),
            notesParagraphs: {
                [noteId]: paragraphs,
            },
        });
    }

    function pageLoadedReducer(
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

    async function effect() {
            const [notes, paragraphs] = await Promise.all([
                noteService.getAll(),
                paragraphService.getByParentId(Note.UNSORTED.id),
            ]);

            initialLoaded([Note.UNSORTED.id, notes, paragraphs]);
        }
}
