import { createEffect, sample, createEvent, Store } from "effector";

import { Service, Loader, Note, Paragraph, History, FP } from "..";

import { Root } from "./root";

// Add paragraph

export const initParagraph = createEvent<string>();
export const addParagraph = createEvent<Paragraph.T>();
export const updateParagraphs = createEvent<Paragraph.T[]>();

export function onAddParagraph(
    store: Store<Root>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    store.on(addParagraph, reducer);

    sample({
        clock: initParagraph,
        source: store,
        fn: (root: Root, title: string) => [root, title] as const,
        target: createEffect(effect),
    });

    function reducer(
        root: Root,
        newParagraph: Paragraph.T,
    ): Root | void {
        if (!newParagraph.title || Loader.isLoading(root)) {
            return;
        }

        return Loader.map(root, state => {
            const noteId = History.getLast(History.getCurrent(state.history));
            return {
                ...state,
                paragraphs: {
                    ...state.paragraphs,
                    [newParagraph.id]: newParagraph,
                },
                notesParagraphs: {
                    ...state.notesParagraphs,
                    [noteId]: state.notesParagraphs[noteId].concat(newParagraph.id),
                },
            };
        });
    }

    async function effect([root, title]: [Root, string]) {
        if (!title || Loader.isLoading(root)) {
            return;
        }

        const noteId = FP.pipe(
            History.getCurrent,
            History.getLast,
        )(root.data.history);

        const noteParagraphs = root.data.notesParagraphs[noteId]
            .map(paragraphId => root.data.paragraphs[paragraphId]);

        const newParagraph = Paragraph.setPosition(
            Paragraph.make(title),
            Paragraph.getNextPosition(noteParagraphs, noteId),
            noteId,
        );

        addParagraph(newParagraph);
        await paragraphService.set(newParagraph);
        updateParagraphs(await paragraphService.getByParentId(noteId));
    }
}

export function onUpdateParagraphs(store: Store<Root>) {
    store.on(updateParagraphs, reducer);

    function reducer(root: Root, paragraphs: Paragraph.T[]): Root {
        return Loader.map(root, state => {
            const noteId = History.getLast(History.getCurrent(state.history));

            return {
                ...state,
                paragraphs: paragraphs.reduce(
                    (acc, paragraph) => ({ ...acc, [paragraph.id]: paragraph }),
                    state.paragraphs,
                ),
                notesParagraphs: {
                    ...state.notesParagraphs,
                    [noteId]: paragraphs.map(({ id }) => id),
                }
            }
        });
    }
}
