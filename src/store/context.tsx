import { Store as EffectorStore } from "effector";
import { PropsWithChildren, createContext } from "react";

import { DB, Note, Paragraph } from "..";
import { Actions, Root, make } from "./root";

const [store, actions] = make(
    new DB.InMemory<Note.T>([Note.UNSORTED]),
    new DB.RelationalInMemory<Note.T, Paragraph.T>([Paragraph.EMPTY]),
);

export const StoreContext = createContext<EffectorStore<Root>>(store);
export const ActionContext = createContext<Actions>(actions);

export function Provider({ children }: PropsWithChildren) {
    return <StoreContext.Provider value={store}>
        <ActionContext.Provider value={actions}>
            {children}
        </ActionContext.Provider>
    </StoreContext.Provider>;
};