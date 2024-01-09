import { createEffect, sample, createEvent, Store } from "effector";

import { Service, Loader, Note, Paragraph, Option } from "..";

import { Root } from "./root";

export const updateParagraph = createEvent<Paragraph.T>();

export function onUpdateParagraph(
    store: Store<Root>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    store.on(updateParagraph, reducer);

    sample({
        clock: updateParagraph,
        target: createEffect(effect),
    });

    async function effect(paragraph: Paragraph.T) {
        if (paragraph.title === "") {
            return;
        }
        const currentParagraph = await paragraphService.get(paragraph.id);

        if (currentParagraph.title === paragraph.title) {
            return;
        }

        await paragraphService.set(paragraph);
    }

    function reducer(root: Root, paragraph: Paragraph.T): Root | void {
        return Loader.map(root, state => ({
            ...state,
            paragraphs:{
                ...state.paragraphs,
                [paragraph.id]: paragraph,
            },
            editParagraph: Option.none(),
        }));
    }
}
