import { Unit, createEffect, sample, createEvent, Store } from "effector";

import { Loader, Note, Paragraph, Service } from "..";

import { Root } from "./root";
import { updateParagraphs } from "./updateParagraphs";

export const deleteParagraph = createEvent<Paragraph.T["id"]>();

export function onDeleteParagraph(
    store: Store<Root>,
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    store.on(deleteParagraph, reducer);

    sample({
        clock: deleteParagraph,
        source: selectedNote$,
        fn: (noteId, paragraphId) => [noteId, paragraphId] as const,
        target: createEffect(effect),
    });

    function reducer(root: Root, id: Paragraph.T["id"]): Root | void {
        if (Loader.isLoading(root)) {
            return;
        }

        return Loader.map(root, state => ({
            ...state,
            paragraphs: Object.values(state.paragraphs).reduce(
                (acc, paragraph) => paragraph.id === id
                    ? acc
                    : { ...acc, [paragraph.id]: paragraph },
                {} as Record<Paragraph.T["id"], Paragraph.T>,
            ),
        }));
    }

    async function effect([noteId, paragraphId]: [Note.T["id"], Paragraph.T["id"]]) {
        await paragraphService.delete(paragraphId);

        updateParagraphs(await paragraphService.getByParentId(noteId));
    }
}
