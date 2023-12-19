import { useStoreMap } from "effector-solid";
import { For, onMount, useContext } from "solid-js";

import { Input, Loader, Note, Store } from "..";

export default function() {
  const store = useContext(Store.StoreContext);
  const actions = useContext(Store.ActionContext);

  const notes = useStoreMap<Store.Root, Loader.T<Store.Notes>>(store, store => store.notes);

  onMount(() => actions.init());

  return <Loader.JSX loadable={notes}>
    {notes => <>
      <For each={notes().items}>{note =>
          <h2 onClick={() => actions.selectNote(note.id)}>
            {notes().selected === note.id ? ">" : " "} {note.title}
          </h2>
      }</For>

      <Input.JSX onSubmit={input => actions.addNote(Note.make(input))} />
    </>}
  </Loader.JSX>;
};
