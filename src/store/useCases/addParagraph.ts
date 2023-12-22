import { Unit, createEffect, sample } from "effector";
import { Actions, Root } from "..";
import { DB, Loader, Note, Paragraph } from "../..";

// Add paragraph

export function action(root: Root, newParagraph: Paragraph.T): Root | void {
    if (Loader.isLoading(root.notes) || Loader.isLoading(root.paragraphs)) {
        return;
    }

    return {
        notes: root.notes,
        paragraphs: Loader.loaded({
            items: root.paragraphs.data.items.concat(newParagraph),
        }),
    };
}

/**
 * Add a new paragraph to the service and load the new list of paragraphs
 */
export function FX(
    actions: Actions,
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.addParagraph,
        source: selectedNote$, 
        fn: (noteId, newParagraph) => [newParagraph, noteId] as const,
        target: createEffect<[Paragraph.T, Note.T["id"]], void>(async ([newParagraph, noteId]) => {
            paragraphService.set(newParagraph);
            const newParagraphs = await paragraphService.getByParentId(noteId);
            actions.paragraphsLoaded(newParagraphs);
        }),
    })
}