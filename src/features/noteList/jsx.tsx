import { useStoreMap } from "effector-solid";
import { Accessor, For, onMount, useContext } from "solid-js";

import { Input, Loader, Note, Store } from "..";

function NoteJSX({ note, selectedNote }: { note: Note.T, selectedNote: Accessor<Note.T["id"]>}) {
   const actions = useContext(Store.ActionContext);

   return <h2 onClick={() => actions.selectNote(note.id)}>
      {selectedNote() === note.id ? ">" : " "} {note.title}
   </h2>
}

export function JSX() {
   const store = useContext(Store.StoreContext);
   const actions = useContext(Store.ActionContext);
   const notes = useStoreMap<Store.Root, Loader.T<Store.Notes>>(store, store =>
      store.notes,
   );
   const selectedNote = useStoreMap<Store.Root, Note.T["id"]>(store, store =>
      Loader.getWithDefault(
         Loader.map(store.notes, ({ selected }) => selected),
         Note.UNSORTED.id,
      ),
   );

   onMount(actions.init);

   return <Loader.JSX loadable={notes}>
      {notes => <>
         <For each={notes().items}>
            {note => <NoteJSX note={note} selectedNote={selectedNote}/>}
         </For>

         <Input.JSX onSubmit={input => actions.addNote(Note.make(input))} />
      </>}
   </Loader.JSX>;
};
