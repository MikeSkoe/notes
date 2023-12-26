import { useContext, useState } from "react";

import { NoteJSX, Option, Paragraph, Store } from "../..";

import { T } from "..";

type Props = { paragraph: T; }

type LinkProps = { paragraph: Paragraph.T; }

function Link({ paragraph }: LinkProps) {
    const actions = useContext(Store.ActionContext);
    const [linkSelection, setLinkSelection] = useState(false);

    if (Option.isNone(paragraph.noteLink)) {
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

    return <button
        onClick={() => {
            if (Option.isSome(paragraph.noteLink)) {
                actions.selectNote(paragraph.noteLink.data);
            }
        }}
    >
        open
    </button>;
}

export function Item({ paragraph }: Props) {
    const actions = useContext(Store.ActionContext);

    return <li>
        {paragraph.title}
        <br />
        <Link paragraph={paragraph} />
        <button onClick={() => actions.deleteParagraph(paragraph.id)}>
            delete
        </button>
    </li>
}
