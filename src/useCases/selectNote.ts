import { createEffect, sample } from "effector";

import { Loader, Note, Paragraph, Service } from "..";

import { Root, Actions } from "./root";

// Select a note

export function action(root: Root, selected: Note.T["id"]): Root | void {
    if (Loader.isLoading(root) || root.data.selected === selected) {
        return;
    }
    return Loader.map(root, state => ({
        ...state,
        selected,
    }))
}

/**
 * Load paragraphs of the selected notes
 */
export function FX(
    actions: Actions,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.selectNote,
        target: createEffect(async (noteId: Note.T["id"]) => {
            const paragraphs = await paragraphService.getByParentId(noteId);
            actions.paragraphsLoaded(paragraphs);
        }),
    });
}
