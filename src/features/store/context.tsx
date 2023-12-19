import { Store as EffectorStore } from "effector";
import { ParentComponent, createContext } from "solid-js";

import { DB, Note, Paragraph } from "..";
import { make, Actions } from "./store";
import { Root } from "./root";

const [store, actions] = make(
    new DB.InMemory<Note.T>([Note.UNSORTED]),
    new DB.RelationalInMemory<Note.T, Paragraph.T>([Paragraph.EMPTY]),
);

export const StoreContext = createContext<EffectorStore<Root>>(store);
export const ActionContext = createContext<Actions>(actions);

export const Provider: ParentComponent = ({ children }) => {
    return <StoreContext.Provider value={store}>
        <ActionContext.Provider value={actions}>
            {children}
        </ActionContext.Provider>
    </StoreContext.Provider>;
};