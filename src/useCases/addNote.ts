import { createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph } from "..";

import { Actions, Root } from "./root";

// Add new note

export function preAction(root: Root, _title: string): Root {
    return root;
}

export function action(root: Root, newNote: Note.T): Root {
    return Loader.map(root, state => ({
        ...state,
        notes: state.notes.concat(newNote),
        selectedNote: newNote,
    }));
}

/**
 * Add a new note to with the service and open the note
 */
export function FX(
    actions: Actions,
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.addNewNote,
        target: createEffect<string, void>(effect),
    });

    async function effect(title: string) {
        const newNote = Note.make(title);
        actions.addNote(newNote);
        await noteService.set(newNote);
        const [notes, paragraphs] = await Promise.all([
            noteService.getAll(),
            paragraphService.getByParentId(newNote.id),
        ]);
        actions.loaded({
            notes,
            paragraphs,
            selected: newNote.id,
        })
    }
}
