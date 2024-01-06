import { Store, createStore } from "effector";

import { Loader, Note, Paragraph, Selected, Service, UseCase } from "..";

export function make(
   noteService: Service.Service<Note.T>,
   paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
): {
    store: Store<UseCase.Root>,
    actions: UseCase.Actions,
} {
    const app$ = createStore(UseCase.EMPTY)
        .on(UseCase.init, UseCase.onInit)
        .on(UseCase.initialLoaded, UseCase.onInitalLoaded)
        .on(UseCase.pageLoaded, UseCase.onPageLoaded)
        .on(UseCase.addNote, UseCase.onAddNote)
        .on(UseCase.addParagraph, UseCase.onAddParagraph)
        .on(UseCase.updateParagraphs, UseCase.onUpdateParagraphs)
        .on(UseCase.deleteParagraph, UseCase.onDeleteParagraph)
        .on(UseCase.selectNote, UseCase.onSelectNote)
        .on(UseCase.linkParagraphToNote, UseCase.onLinkParagraphToNote)
        .on(UseCase.back, UseCase.onBack)
        .on(UseCase.front, UseCase.onFront);

    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state, ({ selected }) => Selected.getLast(Selected.getCurrent(selected)).noteId),
            Note.UNSORTED.id,
        ),
    );

    UseCase.initFX(noteService, paragraphService);
    UseCase.addNoteFX(noteService);
    UseCase.addParagraphFX(app$, paragraphService);
    UseCase.selectNoteFX(noteService, paragraphService);
    UseCase.deleteParagraphFX(selectedNote$, paragraphService);
    UseCase.linkParagraphToNoteFX(selectedNote$, paragraphService);

    return {
        store: app$,
        actions: {
            init: UseCase.init,
            selectNote: UseCase.selectNote,
            addNote: UseCase.addNote,
            addParagraph: UseCase.initParagraph,
            deleteParagraph: UseCase.deleteParagraph,
            linkParagraphToNote: UseCase.linkParagraphToNote,
            back: UseCase.back,
            front: UseCase.front,
        }
    };
}
