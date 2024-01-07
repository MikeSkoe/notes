import { Unit, createEffect, sample, createEvent } from "effector";

import { Loader, Note, Paragraph, Service } from "..";
import { updateParagraphs } from "./addParagraph";

import { Root } from "./root";

// Delete paragraph

// --- Events ---

export const deleteParagraph = createEvent<Paragraph.T["id"]>();

// --- Reducers ---

export function onDeleteParagraph(root: Root, id: Paragraph.T["id"]): Root | void {
    if (Loader.isLoading(root)) {
        return;
    }

    return Loader.map(root, state => ({
        ...state,
        notesParagraphs: Object.keys(state.notesParagraphs).reduce(
            (acc: Loader.Unwrap<Root>["notesParagraphs"], noteId: Note.T["id"]) => ({
                ...acc,
                [noteId]: state.notesParagraphs[noteId].filter(paragraph => paragraph.id !== id),
            }),
            {},
        ),
    }));
}

// --- FXs ---

export function deleteParagraphFX(
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: deleteParagraph,
        source: selectedNote$,
        fn: (noteId: Note.T["id"], paragraphId: Paragraph.T["id"]) => [noteId, paragraphId] as const,
        target: createEffect(effect),
    });

    async function effect([noteId, paragraphId]: [Note.T["id"], Paragraph.T["id"]]) {
        await paragraphService.delete(paragraphId);

        updateParagraphs(await paragraphService.getByParentId(noteId));
    }
}
