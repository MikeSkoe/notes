import { useContext, useState } from "react";

import { NoteJSX, Option, Store } from "../..";

import { T } from "..";

type Props = {
   paragraph: T;
}

export function Item({ paragraph }: Props) {
   const actions = useContext(Store.ActionContext);
   const [linkSelection, setLinkSelection] = useState(false);

   return <li>
      <button onClick={() => actions.deleteParagraph(paragraph.id)}>delete paragraph</button>
      {paragraph.title}

      {Option.isNone(paragraph.noteLink)
         ? linkSelection
            ? <NoteJSX.Select onSelect={noteId => actions.linkParagraphToNote([paragraph.id, noteId])} />
            : <button onClick={() => setLinkSelection(true)}>link to</button>
         : <button onClick={() => {
            if (Option.isNone(paragraph.noteLink)) {
               return;
            }
            actions.selectNote(paragraph.noteLink.data);
         }}>go to link</button>
      }
   </li>
}