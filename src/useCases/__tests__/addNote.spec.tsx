import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Service, Note, Paragraph, Store, NoteJSX } from "../..";

test("Add new note", async () => {
   const user = userEvent.setup();
   const [store, actions] = Store.make(
      new Service.InMemory<Note.T>([Note.UNSORTED]),
      new Service.RelationalInMemory<Note.T, Paragraph.T>([]),
   );

   const { getByText, getByRole } = render(
      <Store.Provider store={store} actions={actions}>
         <NoteJSX.List />
      </Store.Provider>
   );

   await waitFor(() => {
      expect(getByText(Note.UNSORTED.title)).toBeInTheDocument()
   });

   await user.type(getByRole("textbox"), "New note");
   await user.keyboard("{Enter}");

   await waitFor(() => {
      expect(getByText("New note")).toBeInTheDocument()
   });
});
