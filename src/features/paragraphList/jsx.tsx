import { useStoreMap } from "effector-solid";
import { For, createEffect, useContext } from "solid-js";

import { Loader, Note, Paragraph, Store } from "..";

export default function () {
  const store = useContext(Store.StoreContext);
  const actions = useContext(Store.ActionContext);

  const selectedNoteId = useStoreMap<Store.T, Note.T["id"]>(store, store => store.selectedNoteId);
  const loadableParagraphs = useStoreMap<Store.T, Loader.T<Paragraph.T[]>>(store, store => store.paragraphs)

  createEffect(() => {
    const noteId = selectedNoteId();
    if (noteId) {
      actions.loadParagraphs(noteId);
    }
  });

  return <Loader.JSX loadable={loadableParagraphs}>
    {paragraphs => <For each={paragraphs}>
      {({ title }) => <h3>{title}</h3>}
    </For>}
  </Loader.JSX>
}
