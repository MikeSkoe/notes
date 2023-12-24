import { useContext } from "react";

import { Store } from "../..";

import { T } from "..";

export function Item({ note, selectedNote }: { note: T, selectedNote: T["id"]}) {
   const actions = useContext(Store.ActionContext);
   const prefix = selectedNote === note.id ? ">" : " ";

   return <div>
      <span>{prefix}</span>
      <span onClick={() => actions.selectNote(note.id)}>
         {note.title}
      </span>
   </div>
}
