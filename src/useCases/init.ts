import { createEffect, sample } from "effector";

import { Service, Note, Paragraph, Loader } from "..";

import { Root, T, Actions, EMPTY } from "./root";

// Initialize the application

export function action(): Root {
    return EMPTY;
}

export function loaded(_: Root, state: T): Root {
    return Loader.loaded(state);
};

export function paragraphsLoaded(root: Root, paragraphs: Paragraph.T[]): Root {
    return Loader.map(root, state => ({...state, paragraphs }));
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

        actions.loaded({
            notes,
            paragraphs,
            selected: Note.UNSORTED.id,
        });
    }
}
