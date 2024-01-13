import { useEffect } from "react";
import { Note, Paragraph, Service, Store } from "..";

export function StoreDecorator(Story: () => JSX.Element) {
  // mock
  const newNote = Note.make("111");

  // mock
  const notes = [
      Note.UNSORTED,
      newNote,
  ];

  // mock
  const paragraphs = [
      Paragraph.linkToNote(Paragraph.EMPTY, newNote.id),
      Paragraph.setPosition(Paragraph.make("a"), 0, newNote.id),
      Paragraph.linkToNote(Paragraph.setPosition(Paragraph.make("b"), 100, newNote.id), Note.UNSORTED.id),
  ];

  const { store, actions } = Store.make(
      new Service.InMemory<Note.T>(notes),
      new Service.RelationalInMemory<Note.T, Paragraph.T>(paragraphs),
  );

  useEffect(() => void actions.init(), []);

	return (
	    <Store.StoreContext.Provider value={store}>
		    <Store.ActionContext.Provider value={actions}>
		        <Story />
		    </Store.ActionContext.Provider>
	    </Store.StoreContext.Provider>
	);
}
