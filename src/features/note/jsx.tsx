import { Accessor, useContext } from "solid-js";

import { Store } from "..";
import { T } from "./entity";

export function JSX({ note, selectedNote }: { note: T, selectedNote: Accessor<T["id"]>}) {
   const actions = useContext(Store.ActionContext);

   return <h2 onClick={() => actions.selectNote(note.id)}>
      {selectedNote() === note.id ? ">" : " "} {note.title}
   </h2>
}
