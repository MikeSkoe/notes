import { createEffect, sample } from "effector";

import { Loader, Note, Paragraph, Service } from "..";

import { Root, Actions } from "./root";

// Select a note

export function action(root: Root, newSelected: Note.T["id"]): Root | void {
    if (!Loader.isLoaded(root.notes) || root.notes.data.selected === newSelected) { return; }

    return {
        ...root,
        notes: Loader.loaded({
            items: root.notes.data.items,
            selected: newSelected,
        }),
    };
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
