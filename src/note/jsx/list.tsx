import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, Store, UseCase } from "../..";

import { Item } from "./item";

export function List() {
   const store = useContext(Store.StoreContext);
   const notes = useStoreMap<UseCase.Root, Loader.T<UseCase.Notes>>(store, store => store.notes);

   return <LoaderJSX.Show loadable={notes}>{notes =>
      <ul>{notes.items.map(note =>
         <Item key={note.id} note={note} selectedNote={notes.selected}/> )}
      </ul>
   }</LoaderJSX.Show>;
};