import { createEffect } from "effector";

import { Note, Paragraph, Service } from "..";

import { initialLoaded, pageLoaded } from "./init";

// Select a note

// --- FXs ---

export function selectNoteFX(
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return createEffect(async ([noteId, force]: [Note.T["id"], boolean]) => {
        const paragraphs = await paragraphService.getByParentId(noteId);
        if (force) {
            initialLoaded([noteId, await noteService.getAll(), paragraphs]);
            return;
        }
        pageLoaded([noteId, paragraphs]);
    });
}
