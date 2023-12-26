import { createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph } from "..";

import { Actions, Root } from "./root";

// Add new note

export function preAction(root: Root, _title: string): Root {
    return root;
}

export function action(root: Root, newNote: Note.T): Root {
    const loadedNotes: Note.T[] = Loader.getWithDefault(
        Loader.map(root.notes, ({ items }) => items),
        [],
    );

    return {
        notes: Loader.loaded({
            items: loadedNotes.concat(newNote),
            selected: newNote.id,
        }),
        paragraphs: Loader.loading(),
    };
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
        const newNotes = await noteService.getAll();
        actions.notesLoaded([newNote.id, newNotes]);
        const newParagraphs = await paragraphService.getByParentId(newNote.id);
        actions.paragraphsLoaded(newParagraphs);
    }
}
