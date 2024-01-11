import { createEffect, createEvent, sample, Store } from "effector";

import { Service, Note, Paragraph, Loader, History, Option } from "..";

import { Root } from "./root";

export const init = createEvent();
export const initialLoaded = createEvent<[Note.T["id"], Note.T[], Paragraph.T[]]>();
export const pageLoaded = createEvent<[Note.T["id"], Paragraph.T[], boolean]>();

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
            paragraphs: paragraphs.reduce(
                (acc, paragraph) => ({ ...acc, [paragraph.id]: paragraph }),
                {} as Record<Paragraph.T["id"], Paragraph.T>,
            ),
            history: History.make(noteId),
            editParagraph: Option.none(),
        });
    }

    function pageLoadedReducer(
        root: Root,
        [noteId, paragraphs, forward]: [Note.T["id"], Paragraph.T[], boolean],
    ): Root {
        return Loader.map(root, state => ({
            notes: state.notes,
            history: History.add(state.history, noteId, forward),
            paragraphs: paragraphs.reduce(
                (acc, paragraph) => ({...acc, [paragraph.id]: paragraph }),
                state.paragraphs,
            ),
            editParagraph: Option.none(),
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
