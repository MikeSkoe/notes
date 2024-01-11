import { createEvent, Store } from "effector";

import { Loader, Paragraph } from "..";

import { Root } from "./root";

export const updateParagraphs = createEvent<Paragraph.T[]>();

export function onUpdateParagraphs(store: Store<Root>) {
    store.on(updateParagraphs, reducer);

    function reducer(root: Root, paragraphs: Paragraph.T[]): Root {
        return Loader.map(root, state => ({
            ...state,
            paragraphs: paragraphs.reduce(
                (acc, paragraph) => ({ ...acc, [paragraph.id]: paragraph }),
                state.paragraphs,
            ),
        }));
    }
}
