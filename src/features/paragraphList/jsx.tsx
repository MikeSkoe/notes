import { useStoreMap } from "effector-solid";
import { For, useContext } from "solid-js";

import { Input, Loader, Note, Paragraph, Store } from "..";

export default function () {
   const store = useContext(Store.StoreContext);
   const actions = useContext(Store.ActionContext);

   const selectedNoteId = useStoreMap<Store.Root, Note.T["id"]>(
      store,
      store => Loader.isLoaded(store.notes)
         ? store.notes.data.selected
         : Note.UNSORTED.id,
   );

   const loadableParagraphs = useStoreMap<Store.Root, Loader.T<Store.Paragraphs>>(store, store => store.paragraphs)

   return <Loader.JSX loadable={loadableParagraphs}>
      {paragraphs => <>
         <For each={paragraphs().items}>
            {/* TODO? move to the paragraph feature */}
            {paragraph => <>
               <h3>{paragraph.title}</h3>
               <button onClick={() => actions.deleteParagraph(paragraph.id)}>x</button>
            </>}
         </For>

         <Input.JSX
            onSubmit={title => {
               const paragraphs = Loader.getWithDefault(loadableParagraphs(), { items: [] }).items;
               const noteId = selectedNoteId();
               actions.addParagraph(Paragraph.make(title, noteId, Paragraph.getNextPosition(paragraphs, noteId)));
            }}
         />
      </>}
   </Loader.JSX>;
}
