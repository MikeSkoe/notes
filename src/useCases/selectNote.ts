import { createEffect, createEvent, sample } from "effector";

import { Note, Paragraph, Service } from "..";

import { initialLoaded, pageLoaded } from "./init";
import { Root } from "./root";

// Select a note

// --- Events ---
export const selectNote = createEvent<[Note.T["id"], boolean]>();

// --- Reducers ---
export function onSelectNote(root: Root, []: [Note.T["id"], boolean]): Root | void {
    return root;
}

// --- FXs ---
export function selectNoteFX(
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: selectNote,
        target: createEffect(async ([noteId, force]: [Note.T["id"], boolean]) => {
            const paragraphs = await paragraphService.getByParentId(noteId);
            if (force) {
                initialLoaded([noteId, await noteService.getAll(), paragraphs]);
                return;
            }
            pageLoaded({ noteId, paragraphs });
        }),
    });
}
