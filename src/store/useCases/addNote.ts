import { createEffect, sample } from "effector";
import { Actions, Notes, Root } from "..";
import { DB, Loader, Note, Paragraph } from "../..";

// Add new note

export function action(root: Root, newNote: Note.T): Root {
    const loadedNotes: Notes = Loader.getWithDefault(root.notes, { items: [], selected: Note.UNSORTED.id });

    return {
        notes: Loader.loaded({
            items: loadedNotes.items.concat(newNote),
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
    noteService: DB.Service<Note.T>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.addNote,
        target: createEffect(async (newNote: Note.T) => {
            await noteService.set(newNote);
            const newNotes = await noteService.getAll();
            actions.notesLoaded([newNote.id, newNotes]);
            const newParagraphs = await paragraphService.getByParentId(newNote.id);
            actions.paragraphsLoaded(newParagraphs);
        }),
    });
}
