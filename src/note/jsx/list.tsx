import { useStoreMap } from "effector-react";
import { useContext, useEffect } from "react";

import { Input, Loader, LoaderJSX, Note, Store } from "../..";

import { Item } from "./item";

export function List() {
   const store = useContext(Store.StoreContext);
   const actions = useContext(Store.ActionContext);
   const notes = useStoreMap<Store.Root, Loader.T<Store.Notes>>(store, store => store.notes);
   const selectedNote = useStoreMap<Store.Root, Note.T["id"]>(store, store =>
      Loader.getWithDefault(
         Loader.map(store.notes, ({ selected }) => selected),
         Note.UNSORTED.id,
      ),
   );

   useEffect(actions.init, []);

   return <LoaderJSX.Show loadable={notes}>
      {notes => <>
         {notes.items.map(note =>
            <Item key={note.id} note={note} selectedNote={selectedNote}/> )}

         <Input.JSX onSubmit={input => actions.addNote(Note.make(input))} />
      </>}
   </LoaderJSX.Show>;
};