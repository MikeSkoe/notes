import { Unit, createEffect, sample } from "effector";

import { Loader, Note, Paragraph, Service } from "..";

import { Root, Actions } from "./root";

// Delete paragraph

export function action(root: Root, id: Paragraph.T["id"]): Root | void {
    if (Loader.isLoading(root)) {
        return;
    }

    return Loader.map(root, state => ({
        ...state,
        paragraphs: state.paragraphs.filter(pr => pr.id !== id),
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
        const paragraphs = await paragraphService.getByParentId(noteId);
        actions.paragraphsLoaded(paragraphs);
    }
}
