import { ID, Note } from "..";

export type T = ID.WithId & ID.WithParents<Note.T> & { title: string; };

export const EMPTY: T = {
    id: ID.make(),
    title: "empty paragraph",
    parents: { [Note.UNSORTED.id]: 1 },
};

export const make = (
    title: string,
    noteId: Note.T["id"],
    position: number,
): T => ({
    id: ID.make(),
    title,
    parents: { [noteId]: position },
});

export function getNextPosition(paragraphs: T[], parent: Note.T["id"]): number {
    const STEP = 100;
    const largestPosition = paragraphs
        .map(({ parents }) => parents[parent])
        .reduce((largest, current) => Math.max(largest, current), 0);
    return STEP + largestPosition;
}