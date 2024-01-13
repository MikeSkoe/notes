import { Store, createStore } from "effector";

import { Loader, Note, Paragraph, History, Service, UseCase } from "..";

export interface Actions {
    init: () => void;
    selectNote: (_: [Note.T["id"], boolean, boolean]) => void;
    addNote: (_: string) => void;
    addParagraph: (_: string) => void;
    updateParagraph: (_: Paragraph.T) => void;
    startEditingParagraph: (_: Paragraph.T["id"]) => void;
    cancelEditingParagraph: (_: void) => void;
    deleteParagraph: (_: Paragraph.T["id"]) => void;
    linkParagraphToNote: (_: [Paragraph.T["id"], Note.T["id"]]) => void;
    back: (_: void) => void;
    front: (_: void) => void;
}

export function make(
   noteService: Service.Service<Note.T>,
   paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
): {
    store: Store<UseCase.Root>,
    actions: Actions,
} {
    const app$ = createStore(UseCase.EMPTY);
    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state, ({ history }) => History.getLast(History.getCurrent(history))),
            Note.UNSORTED.id,
        ),
    );

    UseCase.onLoaded(app$, noteService, paragraphService);
    UseCase.onAddParagraph(app$, paragraphService);
    UseCase.onUpdateParagraphs(app$);
    UseCase.onAddNote(noteService);
    UseCase.onDeleteParagraph(app$, selectedNote$, paragraphService);
    UseCase.onLinkParagraphToNote(app$, selectedNote$, paragraphService);
    UseCase.onSelectNote(noteService, paragraphService);
    UseCase.onRoute(app$);
    UseCase.onUpdateParagraph(app$, paragraphService);
    UseCase.onStartEditing(app$);

    return {
        store: app$,
        actions: {
            init: UseCase.init,
            selectNote: UseCase.selectNote,
            addNote: UseCase.addNote,
            addParagraph: UseCase.initParagraph,
            startEditingParagraph: UseCase.startEditingParagraph,
            cancelEditingParagraph: UseCase.cancelEditingParagraph,
            updateParagraph: UseCase.updateParagraph,
            deleteParagraph: UseCase.deleteParagraph,
            linkParagraphToNote: UseCase.linkParagraphToNote,
            back: UseCase.back,
            front: UseCase.front,
        }
    };
}
