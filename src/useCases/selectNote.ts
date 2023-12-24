import { createEffect, sample } from "effector";

import { Loader, Note, Paragraph, Root, Service } from "..";

// Select a note

export function action(root: Root.T, newSelected: Note.T["id"]): Root.T | void {
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
    actions: Root.Actions,
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
