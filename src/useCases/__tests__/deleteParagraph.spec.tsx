import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { Note, Paragraph, ParagraphJSX, Service, Store } from "../..";

test("Delete paragraph", async () => {
    const user = userEvent.setup();
    const { store, actions } = Store.make(
        new Service.InMemory<Note.T>([Note.UNSORTED]),
        new Service.RelationalInMemory<Note.T, Paragraph.T>([Paragraph.EMPTY]),
    );

    const { getByText, queryByText } = render(
        <Store.Provider store={store} actions={actions}>
            <ParagraphJSX.List />
        </Store.Provider>
    );

    await waitFor(() => expect(getByText(Paragraph.EMPTY.title)).toBeInTheDocument());
    await user.click(getByText(/delete/i));

    expect(queryByText(Paragraph.EMPTY.title)).toBeNull();
});
