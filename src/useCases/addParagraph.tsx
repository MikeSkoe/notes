import { Unit, createEffect, sample, createEvent } from "effector";

import { Service, Loader, Note, Paragraph, History, FP } from "..";

import { Root } from "./root";

// Add paragraph

// --- Events ---

export const initParagraph = createEvent<string>();
export const addParagraph = createEvent<Paragraph.T>();
export const updateParagraphs = createEvent<Paragraph.T[]>();

// --- Reducers ---

export function onAddParagraph(root: Root, newParagraph: Paragraph.T): Root | void {
    if (!newParagraph.title || Loader.isLoading(root)) {
        return;
    }

    return Loader.map(root, state => {
        const noteId = History.getLast(History.getCurrent(state.history));
        return {
            ...state,
            notesParagraphs: {
                ...state.notesParagraphs,
                [noteId]: state.notesParagraphs[noteId].concat(newParagraph),
            },
        };
    });
}

export function onUpdateParagraphs(root: Root, paragraphs: Paragraph.T[]): Root {
    return Loader.map(root, state => {
        const noteId = History.getLast(History.getCurrent(state.history));
        return {
            ...state,
            notesParagraphs: {
                ...state.notesParagraphs,
                [noteId]: paragraphs,
            }
        }
    });
}

// --- FXs ---

export function addParagraphFX(
    root$: Unit<Root>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: initParagraph,
        source: root$,
        fn: (root: Root, title: string) => [root, title] as const,
        target: createEffect(effect),
    });

    async function effect([root, title]: [Root, string]) {
        if (!title || Loader.isLoading(root)) {
            return;
        }

        const noteId = FP.pipe(
            History.getCurrent,
            History.getLast,
        )(root.data.history);

        const newParagraph = Paragraph.setPosition(
            Paragraph.make(title),
            Paragraph.getNextPosition(root.data.notesParagraphs[noteId], noteId),
            noteId,
        );

        addParagraph(newParagraph);
        await paragraphService.set(newParagraph);

        updateParagraphs(await paragraphService.getByParentId(noteId));
    }
}
