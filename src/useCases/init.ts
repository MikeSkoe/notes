import { createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph } from "..";

import { Root, Actions, EMPTY } from "./root";

// Initialize the application

export function action(): Root {
    return EMPTY;
}

export function notesLoaded(_: Root, [selected, items]: [Note.T["id"], Note.T[]]): Root {
    return ({
        notes: Loader.loaded({ items, selected }),
        paragraphs: Loader.loading(),
    });
};

export function paragraphsLoaded(root: Root, items: Paragraph.T[]): Root | void {
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
    actions: Actions,
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.init,
        target: createEffect(effect),
    });

    async function effect() {
        const notes = await noteService.getAll();
        actions.notesLoaded([Note.UNSORTED.id, notes]);
        const paragraphs = await paragraphService.getByParentId(Note.UNSORTED.id);
        actions.paragraphsLoaded(paragraphs);
    }
}

