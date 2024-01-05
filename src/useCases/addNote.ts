import { createEffect, createEvent, sample } from "effector";

import { Service, Note } from "..";

import { initialLoaded } from "./init";
import { Root } from "./root";

// Add new note

// --- Events ---
export const addNote = createEvent<string>();

// --- Reducers ---
export function onAddNote(root: Root, _title: string): Root {
    return root;
}

// --- FXs ---
export function addNoteFX(
    noteService: Service.Service<Note.T>,
) {
    return sample({
        clock: addNote,
        target: createEffect<string, void>(effect),
    });

    async function effect(title: string) {
        const newNote = Note.make(title);
        await noteService.set(newNote);
        const newNotes = await noteService.getAll();

        initialLoaded([newNote.id, newNotes, []]);
    }
}
