import { createEffect, createEvent, sample } from "effector";

import { Service, Note } from "..";

import { initialLoaded } from "./init";

// Add new note

export const addNote = createEvent<string>();

export function onAddNote(noteService: Service.Service<Note.T>) {
    sample({
        clock: addNote,
        target: createEffect(effect),
    });

    async function effect(title: string) {
        const newNote = Note.make(title);
        await noteService.set(newNote);
        const newNotes = await noteService.getAll();

        initialLoaded([newNote.id, newNotes, []]);
    }
}
