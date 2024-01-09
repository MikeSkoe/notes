import { createEffect, createEvent, sample } from "effector";

import { Note, Paragraph, Service } from "..";

import { initialLoaded, pageLoaded } from "./init";

export const selectNote = createEvent<[Note.T["id"], boolean]>();

export function onSelectNote(
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    sample({
        clock: selectNote,
        target: createEffect(effect),
    });

    async function effect([noteId, force]: [Note.T["id"], boolean]) {
        const paragraphs = await paragraphService.getByParentId(noteId);

        if (force) {
            initialLoaded([noteId, await noteService.getAll(), paragraphs]);
        } else {
            pageLoaded([noteId, paragraphs]);
        }
    }
}
