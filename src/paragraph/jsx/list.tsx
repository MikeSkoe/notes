import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, Selected, Store, UseCase } from "../..";

import { Item } from "./item";

export function List() {
    const root$ = useContext(Store.StoreContext);
    const loadablePages = useStoreMap(root$, root =>
        Loader.map(root, ({ selected }) =>
            Selected.getCurrent<UseCase.Page>(selected)),
    );

    return <LoaderJSX.Show loadable={loadablePages}>{pages =>
        <ul className="flex">{pages.map(page => <li key={page.noteId}>
            <p>{page.noteId}</p>
            <ul>{page.paragraphs.map(paragraph =>
                <Item key={paragraph.id} paragraph={paragraph} />)
            }</ul>
        </li>)}</ul>
    }</LoaderJSX.Show>;
}
