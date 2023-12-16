import { useStoreMap } from "effector-solid";
import { For, onMount, useContext } from "solid-js";

import { Loader, Note, Store } from "..";

export default function() {
  const store = useContext(Store.StoreContext);
  const actions = useContext(Store.ActionContext);

  const loadableNotes = useStoreMap<Store.T, Loader.T<Note.T[]>>(store, store => store.notes);

  onMount(() => actions.loadNotes());

  return <Loader.JSX loadable={loadableNotes}>{notes =>
    <For each={notes}>{({ title }) =>
      <h2>{title}</h2>
    }</For>
  }</Loader.JSX>
}