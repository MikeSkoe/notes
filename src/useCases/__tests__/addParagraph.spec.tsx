import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Service, Note, Paragraph, Store, ParagraphJSX } from "../..";

test("Add new paragraph", async () => {
    const user = userEvent.setup();
    const [store, actions] = Store.make(
        new Service.InMemory<Note.T>([Note.UNSORTED]),
        new Service.RelationalInMemory<Note.T, Paragraph.T>([Paragraph.EMPTY]),
    );

    const { getByText, getByRole } = render(
        <Store.Provider store={store} actions={actions}>
            <ParagraphJSX.List />
            <ParagraphJSX.AddNew />
        </Store.Provider>
    );

    await waitFor(() => {
        expect(getByText(Paragraph.EMPTY.title)).toBeInTheDocument()
    });

    await user.type(getByRole("textbox"), "New paragraph");
    await user.keyboard("{Enter}");

    await waitFor(() => {
        expect(getByText("New paragraph")).toBeInTheDocument()
   });
});
