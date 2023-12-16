import { Id, Note } from "..";

export type T = Id.WithId & Id.WithParents<Note.T> & { title: string; };

export const EMPTY: T = { id: Id.make(), title: "empty paragraph", parents: { [Note.EMPTY.id]: 1 } };

export const make = (
    title: string,
    noteId: Note.T["id"],
    position: number,
): T => ({
    id: Id.make(),
    title,
    parents: { [noteId]: position },
});