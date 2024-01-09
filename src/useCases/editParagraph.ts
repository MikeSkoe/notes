import { createEvent, Store } from "effector";

import { Loader, Option, Paragraph } from "..";

import { Root } from "./root";

export const startEditingParagraph = createEvent<Paragraph.T["id"]>();
export const cancelEditingParagraph = createEvent();

export function onStartEditing(store: Store<Root>) {
    store.on(startEditingParagraph, startEditingReducer);
    store.on(cancelEditingParagraph, cancelEditingReducer);

    function startEditingReducer(root: Root, editParagraph: Paragraph.T["id"]): Root {
        return Loader.map(root, state => ({
            ...state,
            editParagraph: Option.some(editParagraph),
        }));
    }

    function cancelEditingReducer(root: Root): Root {
        return Loader.map(root, state => ({
            ...state,
            editParagraph: Option.none(),
        }));
    }
}
