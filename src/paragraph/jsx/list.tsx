import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, NoteJSX, History, Store } from "../..";
import { isLoading } from "../../loader";

import { Item } from "./item";

function Page({ noteId }: { noteId: string }) {
    const root$ = useContext(Store.StoreContext);
    const paragraphs = useStoreMap({
        store: root$,
        keys: [noteId] as const,
        fn: (state, [id]) =>
            isLoading(state)
                ? []
                : state.data.notesParagraphs[id],
    });

    return <ul>{paragraphs.map(paragraph =>
        <Item key={paragraph.id} paragraph={paragraph} />)
    }</ul>
}

export function List() {
    const root$ = useContext(Store.StoreContext);
    const noteIds = useStoreMap(root$, root =>
        Loader.map(root, ({ history }) =>
            History.getCurrent(history)),
    );

    return <LoaderJSX.Show loadable={noteIds}>{noteIds => (
        <ul className="flex">{noteIds.map(noteId => <li key={noteId}>
            <NoteJSX.Title id={noteId} />
            <Page noteId={noteId} />
        </li>)}</ul>
    )}</LoaderJSX.Show>;
}
