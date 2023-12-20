import { createEffect, sample } from "effector";

import { Actions, Root } from "..";
import { DB, Loader, Note, Paragraph } from "../..";

// Select a note

export function selectNote(root: Root, newSelected: Note.T["id"]): Root | void {
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
export function selectNoteFX(
    actions: Actions,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.selectNote,
        target: createEffect(async (noteId: Note.T["id"]) => {
            const paragraphs = await paragraphService.getByParentId(noteId);
            actions.paragraphsLoaded(paragraphs);
        }),
    });
}
