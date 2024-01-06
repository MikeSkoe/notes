import { createEffect } from "effector";

import { Service, Note } from "..";

import { initialLoaded } from "./init";

// Add new note

// --- FXs ---

export function addNoteFX(noteService: Service.Service<Note.T>) {
    return createEffect<string, void>(async (title: string) => {
        const newNote = Note.make(title);
        await noteService.set(newNote);
        const newNotes = await noteService.getAll();

        initialLoaded([newNote.id, newNotes, []]);
    });
}
