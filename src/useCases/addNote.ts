import { createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph, Root } from "..";

// Add new note

export function action(root: Root.T, newNote: Note.T): Root.T {
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
    actions: Root.Actions,
    noteService: Service.Service<Note.T>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
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
