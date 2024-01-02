import { Unit, createEffect, sample } from "effector";

import { Loader, Note, Paragraph, Selected, Service } from "..";

import { Root, Actions, Page } from "./root";

// Delete paragraph

// TODO: replace pure functions with effector's events and effects.
// Depend effects directly to events/effect instead an `Actions` interface

export function action(root: Root, id: Paragraph.T["id"]): Root | void {
    if (Loader.isLoading(root)) {
        return;
    }

    return Loader.map(root, ({ notes, selected }) => ({
        notes,
        selected: Selected.update<Page>(({ noteId, paragraphs }) => ({
            noteId,
            paragraphs: paragraphs.filter(p => p.id !== id),
        }))(selected)
    }));
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
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.deleteParagraph,
        source: selectedNote$,
        fn: (noteId: Note.T["id"], paragraphId: Paragraph.T["id"]) => [noteId, paragraphId] as const,
        target: createEffect(effect),
    });

    async function effect([noteId, paragraphId]: [Note.T["id"], Paragraph.T["id"]]) {
        await paragraphService.delete(paragraphId);

        actions.pageLoaded({
            noteId,
            paragraphs: await paragraphService.getByParentId(noteId),
        });
    }
}
