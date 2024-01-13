import { Store as EffectorStore, Store } from "effector";
import { PropsWithChildren, createContext, useEffect } from "react";

import { Service, Note, Paragraph, UseCase } from "..";

import { make, Actions } from "./make";

// mock
const newNote = Note.make("111");

// mock
const notes = [
    Note.UNSORTED,
    newNote,
];

// mock
const paragraphs = [
    Paragraph.linkToNote(Paragraph.EMPTY, newNote.id),
    Paragraph.setPosition(Paragraph.make("a"), 0, newNote.id),
    Paragraph.linkToNote(Paragraph.setPosition(Paragraph.make("b"), 100, newNote.id), Note.UNSORTED.id),
];

const { store: myStore, actions: myActions } = make(
    new Service.InMemory<Note.T>(notes),
    new Service.RelationalInMemory<Note.T, Paragraph.T>(paragraphs),
);

export const StoreContext = createContext<EffectorStore<UseCase.Root>>(myStore);
export const ActionContext = createContext<Actions>(myActions);

type Props = PropsWithChildren<{
    store?: Store<UseCase.Root>,
    actions?: Actions,
}>;

export function Provider({
    children,
    store = myStore,
    actions = myActions,
}: Props) {
    useEffect(() => void actions.init(), []);

    return <StoreContext.Provider value={store}>
        <ActionContext.Provider value={actions}>
            {children}
        </ActionContext.Provider>
    </StoreContext.Provider>;
};
