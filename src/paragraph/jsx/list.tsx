import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, Store } from "../..";

import { Item } from "./item";

export function List() {
    const root$ = useContext(Store.StoreContext);
    const loadableParagraphs = useStoreMap(root$, root =>
        Loader.map(root, ({ paragraphs }) => paragraphs),
    );

    return <LoaderJSX.Show loadable={loadableParagraphs}>{paragraphs =>
        <ul>{paragraphs.map(paragraph =>
            <Item key={paragraph.id} paragraph={paragraph} />)
        }</ul>
    }</LoaderJSX.Show>;
}
