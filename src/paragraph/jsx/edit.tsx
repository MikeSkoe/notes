import { useStoreMap } from "effector-react";
import { useContext, useState } from "react";

import { Loader, Paragraph, Store } from "../..";

type Props = { id: Paragraph.T["id"] }

export function Edit({ id }: Props) {
    const store = useContext(Store.StoreContext);
    const actions = useContext(Store.ActionContext);
    const initialParagraph = useStoreMap(store, state => Loader.getMapWithDefault(
        state,
        ({ paragraphs }) => paragraphs[id] ?? Paragraph.EMPTY,
        Paragraph.EMPTY,
    ));
    const [paragraph, setParagraph] = useState(initialParagraph);

    return <div>
        <textarea
            onKeyDown={event => {
                if (event.key === "Enter" && event.metaKey) {
                    actions.updateParagraph(paragraph);
                }
            }}
            onChange={event => setParagraph(p => Paragraph.setTitle(p, event.target.value))}
            value={paragraph.title}
            placeholder="Enter your markdown here..."
        />
        <button onClick={() => actions.cancelEditingParagraph()}>
            cancel
        </button>
    </div>;
}
