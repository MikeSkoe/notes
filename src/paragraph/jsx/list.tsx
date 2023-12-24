import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Input, Loader, LoaderJSX, Note, Paragraph, Store, Root } from "../..";

import { Item } from "./item";

export function List() {
   const store = useContext(Store.StoreContext);
   const actions = useContext(Store.ActionContext);

   const selectedNoteId = useStoreMap<Root.T, Note.T["id"]>(
      store,
      store => Loader.isLoaded(store.notes)
         ? store.notes.data.selected
         : Note.UNSORTED.id,
   );

   const loadableParagraphs = useStoreMap<Root.T, Loader.T<Root.Paragraphs>>(store, store => store.paragraphs)

   return <LoaderJSX.Show loadable={loadableParagraphs}>
      {paragraphs => <>
         {paragraphs.items.map(paragraph =>
            <Item key={paragraph.id} paragraph={paragraph} />)}

         <Input.JSX
            onSubmit={title => {
               const paragraphs = Loader.getWithDefault(loadableParagraphs, { items: [] }).items;
               const noteId = selectedNoteId;
               actions.addParagraph(Paragraph.make(title, noteId, Paragraph.getNextPosition(paragraphs, noteId)));
            }}
         />
      </>}
   </LoaderJSX.Show>;
}