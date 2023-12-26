import { Store, createApi, createStore } from "effector";

import { Loader, Note, Paragraph, Service, UseCase } from "..";

export function make(
   noteService: Service.Service<Note.T>,
   paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
): [Store<UseCase.Root>, UseCase.Actions] {
    const app$ = createStore(UseCase.EMPTY);
    const api = createApi(app$, {
        init: UseCase.init.action,
        notesLoaded: UseCase.init.notesLoaded,
        paragraphsLoaded: UseCase.init.paragraphsLoaded,
        selectNote: UseCase.selectNote.action,
        addNote: UseCase.addNote.action,
        addNewNote: UseCase.addNote.preAction,
        addParagraph: UseCase.addParagraph.action,
        addNewParagraph: UseCase.addParagraph.preAction,
        deleteParagraph: UseCase.deleteParagraph.action,
    });

    const selectedNote$ = app$.map(
        state => Loader.getWithDefault(
            Loader.map(state.notes, ({ selected }) => selected),
            Note.UNSORTED.id,
        ),
    );

    UseCase.init.FX(api, noteService, paragraphService);
    UseCase.addNote.FX(api, noteService, paragraphService);
    UseCase.addParagraph.FX(api, app$, paragraphService);
    UseCase.selectNote.FX(api, paragraphService);
    UseCase.deleteParagraph.FX(api, selectedNote$, paragraphService);

    return [app$, api];
}
