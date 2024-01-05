import { Unit, createEffect, sample, createEvent } from "effector";

import { Loader, Note, Paragraph, Selected, Service } from "..";

import { pageLoaded } from "./init";
import { Root, Page } from "./root";

// Delete paragraph

// --- Events ---
export const deleteParagraph = createEvent<Paragraph.T["id"]>();

// --- Reducers ---
export function onDeleteParagraph(root: Root, id: Paragraph.T["id"]): Root | void {
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

        pageLoaded({
            noteId,
            paragraphs: await paragraphService.getByParentId(noteId),
        });
    }
}
