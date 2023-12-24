import { createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph, Root } from "..";

// Initialize the application

export function action(): Root.T {
    return Root.EMPTY;
}

export function notesLoaded(_: Root.T, [selected, items]: [Note.T["id"], Note.T[]]): Root.T {
    return ({
        notes: Loader.loaded({ items, selected }),
        paragraphs: Loader.loading(),
    });
};

export function paragraphsLoaded(root: Root.T, items: Paragraph.T[]): Root.T | void {
    if (!Loader.isLoaded(root.notes)) { return; }

    return {
        notes: root.notes,
        paragraphs: Loader.loaded({ items }),
    };
}

/**
 * Load notes and paragraphs of the unsorted note
 * @param api store actions
 * @param noteService
 * @param paragraphService
 */
export function FX(
    actions: Root.Actions,
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.init,
        target: createEffect(async () => {
            const notes = await noteService.getAll();
            actions.notesLoaded([Note.UNSORTED.id, notes]);
            const paragraphs = await paragraphService.getByParentId(Note.UNSORTED.id);
            actions.paragraphsLoaded(paragraphs);
        }),
    });
}

