import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, NoteJSX, History, Store, Paragraph } from "../..";

import { Item } from "./item";

function Page({ noteId, forward }: { noteId: string, forward: boolean }) {
    const root$ = useContext(Store.StoreContext);
    const paragraphs = useStoreMap({
        store: root$,
        keys: [noteId] as const,
        fn: (state, [id]): Paragraph.T["id"][] =>
            Loader.isLoading(state)
                ? []
                : Object.values(state.data.paragraphs)
                    .filter(paragraph => noteId in paragraph.parents)
                    .map(({ id }) => id),
    });

    return <ul>{paragraphs.map(paragraphId =>
        <Item key={paragraphId} id={paragraphId} forward={forward} />)
    }</ul>
}

export function List() {
    const root$ = useContext(Store.StoreContext);
    const noteIds = useStoreMap(root$, root =>
        Loader.map(root, ({ history }) =>
            History.getCurrent(history)),
    );

    return <LoaderJSX.Show loadable={noteIds}>{noteIds => (
        <ul className="flex">{noteIds.map((noteId, index) => <li key={noteId}>
            <NoteJSX.Title id={noteId} />
            <Page noteId={noteId} forward={index === 1} />
        </li>)}</ul>
    )}</LoaderJSX.Show>;
}
