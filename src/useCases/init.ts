import { createEffect, sample } from "effector";

import { Service, Note, Paragraph, Loader, Selected } from "..";

import { Root, Actions, EMPTY, Page } from "./root";

// Initialize the application

export function init(): Root {
    return EMPTY;
}

export function initlaLoaded(_: Root, [noteId, notes, paragraphs]: [Note.T["id"], Note.T[], Paragraph.T[]]): Root {
    return Loader.loaded({
        notes,
        selected: Selected.make({ noteId, paragraphs }),
    });
};

export function pageLoaded(root: Root, page: Page): Root {
    return Loader.map(root, state => ({
        notes: state.notes,
        selected: Selected.add(page)(state.selected),
    }));
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
        const [notes, paragraphs] = await Promise.all([
            noteService.getAll(),
            paragraphService.getByParentId(Note.UNSORTED.id),
        ]);

        actions.initialLoaded([Note.UNSORTED.id, notes, paragraphs]);
    }
}
