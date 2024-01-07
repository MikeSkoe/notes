import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { FP, Loader, LoaderJSX, History, Store, UseCase } from "../..";

import { Item } from "./item";

export function List() {
    const root$ = useContext(Store.StoreContext);
    const loadableNotes = useStoreMap(root$, state =>
        Loader.map(state, ({ notes }) => notes),
    );
    const loadableNoteId = useStoreMap(root$, state =>
        Loader.map(state, ({ history }) => History.getLast(History.getCurrent(history))),
    );

    return <LoaderJSX.Show loadable={loadableNotes}>{notes =>
        <LoaderJSX.Show loadable={loadableNoteId}>{noteId =>
            <ul>{notes.map(note =>
                <Item
                    key={note.id}
                    note={note}
                    selectedNote={noteId}
                />
            )}</ul>
        }</LoaderJSX.Show>
    }</LoaderJSX.Show>;
};
