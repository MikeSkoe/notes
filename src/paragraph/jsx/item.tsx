import { useContext, useState } from "react";
import { useStoreMap } from "effector-react";

import { Loader, NoteJSX, Option, Paragraph, Store } from "../..";

import { T } from "..";
import { Edit } from "./edit";

type LinkProps = {
    paragraph: Paragraph.T;
    forward: boolean;
}

function Link({ paragraph, forward }: LinkProps) {
    const actions = useContext(Store.ActionContext);
    const [linkSelection, setLinkSelection] = useState(false);

    if (Option.isSome(paragraph.noteLink)) {
        return <button
            onClick={() => {
                if (Option.isSome(paragraph.noteLink)) {
                    actions.selectNote([paragraph.noteLink.data, false, forward]);
                }
            }}
        >
            open
        </button>;
    }

    if (linkSelection) {
        return <NoteJSX.Select
            onSelect={noteId => actions.linkParagraphToNote([paragraph.id, noteId])}
            excludeIds={Object.keys(paragraph.parents)}
            goBack={() => setLinkSelection(false)}
        />
    }

    return <button onClick={() => setLinkSelection(true)}>
        link to
    </button>;
}

type Props = {
    id: T["id"];
    forward: boolean;
}

export function Item({ id, forward }: Props) {
    const actions = useContext(Store.ActionContext);
    const store = useContext(Store.StoreContext);
    const paragraph = useStoreMap({
        store,
        fn: state => Loader.getMapWithDefault(
            state,
            ({ paragraphs }) => paragraphs[id],
            Paragraph.EMPTY,
        ),
        keys: [id],
    });
    const editParagraph = useStoreMap(store, state => Loader.getMapWithDefault(
        state,
        ({ editParagraph }) => editParagraph,
        Option.none(),
    ));

    if (Option.isSome(editParagraph) && Option.getWithDefault(editParagraph, Paragraph.EMPTY.id) === id) {
        return <Edit id={id} />;
    }

    return <li>
        <p style={{ whiteSpace: "pre" }} onClick={() => actions.startEditingParagraph(paragraph.id)}>
            {paragraph.title}
        </p>
        <Link paragraph={paragraph} forward={forward} />
        <button onClick={() => actions.deleteParagraph(paragraph.id)}>
            delete
        </button>
    </li>
}
