import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, Store } from "../..";

import { Item } from "./item";

export function List() {
    const root$ = useContext(Store.StoreContext);
    const partialRoot = useStoreMap(root$, root =>
        Loader.map(root, ({ notes, selected }) => ({ notes, selected })),
    );

    return <LoaderJSX.Show loadable={partialRoot}>{({ notes, selected }) =>
        <ul>{notes.map(note =>
            <Item key={note.id} note={note} selectedNote={selected}/> )}
        </ul>
    }</LoaderJSX.Show>;
};
