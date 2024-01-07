import { Store, createStore } from "effector";

import { Loader, Note, Paragraph, History, Service, UseCase } from "..";

export function make(
   noteService: Service.Service<Note.T>,
   paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
): {
    store: Store<UseCase.Root>,
    actions: UseCase.Actions,
} {
    const app$ = createStore(UseCase.EMPTY)
        .on(UseCase.initialLoaded, UseCase.onInitalLoaded)
        .on(UseCase.pageLoaded, UseCase.onPageLoaded)
        .on(UseCase.addParagraph, UseCase.onAddParagraph)
        .on(UseCase.updateParagraphs, UseCase.onUpdateParagraphs)
        .on(UseCase.deleteParagraph, UseCase.onDeleteParagraph)
        .on(UseCase.linkParagraphToNote, UseCase.onLinkParagraphToNote)
        .on(UseCase.back, UseCase.onBack)
        .on(UseCase.front, UseCase.onFront);

    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state, ({ history }) => History.getLast(History.getCurrent(history))),
            Note.UNSORTED.id,
        ),
    );

    const init = UseCase.initFX(noteService, paragraphService);
    const addNote = UseCase.addNoteFX(noteService);
    const selectNote = UseCase.selectNoteFX(noteService, paragraphService);

    UseCase.addParagraphFX(app$, paragraphService);
    UseCase.deleteParagraphFX(selectedNote$, paragraphService);
    UseCase.linkParagraphToNoteFX(selectedNote$, paragraphService);

    return {
        store: app$,
        actions: {
            init,
            selectNote,
            addNote,
            addParagraph: UseCase.initParagraph,
            deleteParagraph: UseCase.deleteParagraph,
            linkParagraphToNote: UseCase.linkParagraphToNote,
            back: UseCase.back,
            front: UseCase.front,
        }
    };
}
