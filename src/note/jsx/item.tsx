import { useContext } from "react";

import { Store } from "../..";

import { T } from "..";

export function Item({ note, selectedNote }: { note: T, selectedNote: T["id"]}) {
   const actions = useContext(Store.ActionContext);
   const selected = selectedNote === note.id;

   return <li onClick={() => actions.selectNote([note.id, true])}>
      {selected ? <b>{note.title}</b> : note.title}
   </li>
}
