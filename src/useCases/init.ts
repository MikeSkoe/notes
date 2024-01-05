import { createEffect, createEvent, sample } from "effector";

import { Service, Note, Paragraph, Loader, Selected } from "..";

import { Root, EMPTY, Page } from "./root";

// Initialize the application

// --- Events ---
export const init = createEvent();
export const initialLoaded = createEvent<[Note.T["id"], Note.T[], Paragraph.T[]]>();
export const pageLoaded = createEvent<Page>();

// --- Reducers ---
export function onInit(): Root {
    return EMPTY;
}

export function onInitalLoaded(_: Root, [noteId, notes, paragraphs]: [Note.T["id"], Note.T[], Paragraph.T[]]): Root {
    return Loader.loaded({
        notes,
        selected: Selected.make({ noteId, paragraphs }),
    });
};

export function onPageLoaded(root: Root, page: Page): Root {
    return Loader.map(root, state => ({
        notes: state.notes,
        selected: Selected.add(page)(state.selected),
    }));
}

// --- FXs ---
export function initFX(
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: init,
        target: createEffect(effect),
    });

    async function effect() {
        const [notes, paragraphs] = await Promise.all([
            noteService.getAll(),
            paragraphService.getByParentId(Note.UNSORTED.id),
        ]);

        initialLoaded([Note.UNSORTED.id, notes, paragraphs]);
    }
}
