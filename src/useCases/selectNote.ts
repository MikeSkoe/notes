import { createEffect, sample } from "effector";

import { Note, Paragraph, Service } from "..";

import { Root, Actions } from "./root";

// Select a note

export function action(root: Root, []: [Note.T["id"], boolean]): Root | void {
    return root;
}

/**
 * Load paragraphs of the selected notes
 */
export function FX(
    actions: Actions,
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.selectNote,
        target: createEffect(async ([noteId, force]: [Note.T["id"], boolean]) => {
            const paragraphs = await paragraphService.getByParentId(noteId);
            if (force) {
                actions.initialLoaded([noteId, await noteService.getAll(), paragraphs]);
                return;
            }
            actions.pageLoaded({ noteId, paragraphs });
        }),
    });
}
