import { Store, createApi, createStore } from "effector";

import { Loader, Note, Paragraph, Selected, Service, UseCase } from "..";

export function make(
   noteService: Service.Service<Note.T>,
   paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
): [Store<UseCase.Root>, UseCase.Actions] {
    const app$ = createStore(UseCase.EMPTY);
    const api = createApi(app$, {
        init: UseCase.init.init,
        initialLoaded: UseCase.init.initlaLoaded,
        pageLoaded: UseCase.init.pageLoaded,
        selectNote: UseCase.selectNote.action,
        addNote: UseCase.addNote.addNote,
        addParagraph: UseCase.addParagraph.addParagraph,
        addNewParagraph: UseCase.addParagraph.preAction,
        deleteParagraph: UseCase.deleteParagraph.action,
        updateParagraphs: UseCase.addParagraph.updateParagraphs,
        linkParagraphToNote: UseCase.linkParagraphToNote.action,
        back: UseCase.router.back, 
        front: UseCase.router.front, 
    });

    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state, ({ selected }) => Selected.getLast(Selected.getCurrent(selected)).noteId),
            Note.UNSORTED.id,
        ),
    );

    UseCase.init.FX(api, noteService, paragraphService);
    UseCase.addNote.FX(api, noteService);
    UseCase.addParagraph.FX(api, app$, paragraphService);
    UseCase.selectNote.FX(api, noteService, paragraphService);
    UseCase.deleteParagraph.FX(api, selectedNote$, paragraphService);
    UseCase.linkParagraphToNote.FX(api, selectedNote$, paragraphService);

    return [app$, api];
}
