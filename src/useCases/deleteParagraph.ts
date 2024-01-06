import { Unit, createEffect, sample, createEvent } from "effector";

import { Loader, Note, Paragraph, History, Service } from "..";
import { updateParagraphs } from "./addParagraph";

import { Root, Page } from "./root";

// Delete paragraph

// --- Events ---

export const deleteParagraph = createEvent<Paragraph.T["id"]>();

// --- Reducers ---

export function onDeleteParagraph(root: Root, id: Paragraph.T["id"]): Root | void {
    if (Loader.isLoading(root)) {
        return;
    }

    return Loader.map(root, ({ notes, history }) => ({
        notes,
        history: History.update<Page>(
            history,
            ({ noteId, paragraphs }) => ({
                noteId,
                paragraphs: paragraphs.filter(p => p.id !== id),
            }),
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
