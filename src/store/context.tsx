import { Store as EffectorStore, Store } from "effector";
import { PropsWithChildren, createContext, useEffect } from "react";

import { Service, Note, Paragraph, Root } from "..";
import { make } from "./make";

const [mainStore, mainActions] = make(
    new Service.InMemory<Note.T>([Note.UNSORTED]),
    new Service.RelationalInMemory<Note.T, Paragraph.T>([Paragraph.EMPTY]),
);

export const StoreContext = createContext<EffectorStore<Root.T>>(mainStore);
export const ActionContext = createContext<Root.Actions>(mainActions);

type Props = PropsWithChildren<{
    store?: Store<Root.T>,
    actions?: Root.Actions,
}>;

export function Provider({
    children,
    store = mainStore,
    actions = mainActions,
}: Props) {
    useEffect(() => actions.init());

    return <StoreContext.Provider value={store}>
        <ActionContext.Provider value={actions}>
            {children}
        </ActionContext.Provider>
    </StoreContext.Provider>;
};
