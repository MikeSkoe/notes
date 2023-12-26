import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { LoaderJSX, Store } from "../..";

import { Item } from "./item";

export function List() {
    const store = useContext(Store.StoreContext);
    const loadableParagraphs = useStoreMap(store, store => store.paragraphs);

    return <LoaderJSX.Show loadable={loadableParagraphs}>{paragraphs =>
        <ul>{paragraphs.items.map(paragraph =>
            <Item key={paragraph.id} paragraph={paragraph} />)
        }</ul>
    }</LoaderJSX.Show>;
}
