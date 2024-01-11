import { useContext } from "react";

import { Store } from "../..";

import { T } from "..";
import { Title } from "./title";

type ItemProps = {
   note: T;
   selectedNote: T["id"];
}

export function Item({ note, selectedNote }: ItemProps) {
   const actions = useContext(Store.ActionContext);
   const selected = selectedNote === note.id;

   return <li onClick={() => actions.selectNote([note.id, true, true])}>
      {selected
         ? <b><Title id={note.id} /></b>
         : <Title id={note.id} />}
   </li>
}
