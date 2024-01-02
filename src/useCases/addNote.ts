import { createEffect, sample } from "effector";

import { Service, Note } from "..";

import { Actions, Root } from "./root";

// Add new note

export function addNote(root: Root, _title: string): Root {
    return root;
}

/**
 * Add a new note to with the service and open the note
 */
export function FX(
    actions: Actions,
    noteService: Service.Service<Note.T>,
) {
    return sample({
        clock: actions.addNote,
        target: createEffect<string, void>(effect),
    });

    async function effect(title: string) {
        const newNote = Note.make(title);
        await noteService.set(newNote);
        const newNotes = await noteService.getAll();

        actions.initialLoaded([newNote.id, newNotes, []]);
    }
}
