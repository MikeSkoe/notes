import { Store } from "effector";

import { DB, Note, Paragraph } from "..";
import { makeEffects } from "./effects";
import { Root, makeRootStore } from "./root";

export type Actions = {
    init: () => void;
    selectNote: (noteId: Note.T["id"]) => void;
    addNote: (newNote: Note.T) => void;
    addParagraph: (newParagraph: Paragraph.T) => void;
    deleteParagraph: (id: Paragraph.T["id"]) => void;
};

export function make(
    noteService: DB.Service<Note.T>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
): [Store<Root>, Actions] {
    return makeEffects(
        makeRootStore(),
        noteService,
        paragraphService,
    );
}
