
import { createEffect, sample } from "effector";
import { DB, Loader, Note, Paragraph } from "..";
import { makeRootStore } from "./root";

export function makeEffects(
    [app$, api]: ReturnType<typeof makeRootStore>,
    noteService: DB.Service<Note.T>,
    paragraphService: DB.RelationalService<Note.T, Paragraph.T>,
): [typeof app$, typeof api] {
    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state.notes, ({ selected }) => selected),
            Note.UNSORTED.id,
        ),
    );

    initialLoadFX();
    addNoteFX();
    addParagraphFX();
    selectNoteFX();
    deleteParagraphFX();

    return [app$, api];

    function deleteParagraphFX() {
        sample({
            clock: api.deleteParagraph,
            source: selectedNote$,
            fn: (noteId, paragraphId) => [noteId, paragraphId] as const,
            target: createEffect<[Note.T["id"], Paragraph.T["id"]], void>(async ([noteId, paragraphId]) => {
                await paragraphService.delete(paragraphId);
                const paragraphs = await paragraphService.getByParentId(noteId);
                api.paragraphsLoaded(paragraphs);
            }),
        })
    }

    // TODO? connect api functions with the relevant FX's and splite files by such use cases

    function initialLoadFX() {
        sample({
            clock: api.init,
            target: createEffect(async () => {
                const notes = await noteService.getAll();
                api.notesLoaded({ items: notes, selected: Note.UNSORTED.id });
                const paragraphs = await paragraphService.getByParentId(Note.UNSORTED.id);
                api.paragraphsLoaded(paragraphs);
            }),
        });
    }

    function addNoteFX() {
        sample({
            clock: api.addNote,
            target: createEffect(async (newNote: Note.T) => {
                await noteService.set(newNote);
                const newNotes = await noteService.getAll();
                api.notesLoaded({ items: newNotes, selected: newNote.id });
                const newParagraphs = await paragraphService.getByParentId(newNote.id);
                api.paragraphsLoaded(newParagraphs);
            }),
        });
    }

    function addParagraphFX() {
        sample({
            clock: api.addParagraph,
            source: selectedNote$, 
            fn: (noteId, newParagraph) => [newParagraph, noteId] as const,
            target: createEffect<[Paragraph.T, Note.T["id"]], void>(async ([newParagraph, noteId]) => {
                paragraphService.set(newParagraph);
                const newParagraphs = await paragraphService.getByParentId(noteId);
                api.paragraphsLoaded(newParagraphs);
            }),
        })
    }

    function selectNoteFX() {
        sample({
            clock: api.selectNote,
            target: createEffect(async (noteId: Note.T["id"]) => {
                const paragraphs = await paragraphService.getByParentId(noteId);
                api.paragraphsLoaded(paragraphs);
            }),
        })
    }
}