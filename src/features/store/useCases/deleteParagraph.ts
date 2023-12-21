import { Unit, createEffect, sample } from "effector";

import { Loader, Note, Paragraph, DB } from "../..";
import { Actions, Root } from "../root";

// Delete paragraph

export function action(root: Root, id: Paragraph.T["id"]): Root | void {
    if (Loader.isLoading(root.paragraphs) || Loader.isLoading(root.notes)) { return; }

    return {
        notes: root.notes,
        paragraphs: Loader.loaded({
            items: root.paragraphs.data.items.filter(pr => pr.id !== id),
        }),
    };
}

/**
 * Delete the paragraph from service and load the new list
 * @param actions Store actions api
 * @param selectedNote$ Current selected note
 * @param paragraphService 
 */
export function FX(
    actions: Actions,
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.deleteParagraph,
        source: selectedNote$,
        fn: (noteId: Note.T["id"], paragraphId: Paragraph.T["id"]) => [noteId, paragraphId] as const,
        target: createEffect<[Note.T["id"], Paragraph.T["id"]], void>(async ([noteId, paragraphId]) => {
            await paragraphService.delete(paragraphId);
            const paragraphs = await paragraphService.getByParentId(noteId);
            actions.paragraphsLoaded(paragraphs);
        }),
    })
}
