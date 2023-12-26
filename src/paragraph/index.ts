import { ID, Note, Option } from "..";

export type T =
    & ID.WithId
    & ID.WithParents<Note.T>
    & {
        title: string;
        noteLink: Option.T<Note.T["id"]>;
    }

export const EMPTY: T = {
    id: ID.make(),
    title: "empty paragraph",
    noteLink: Option.none(),
    parents: { [Note.UNSORTED.id]: 1 },
};

export function linkToNote(t: T, noteId: Note.T["id"]): T {
    return {
        ...t,
        noteLink: Option.some(noteId),
    };
}

export function unlink(t: T): T {
    return {
        ...t,
        noteLink: Option.none(),
    };
}

export function make(title: string): T {
    return {
        ...EMPTY,
        id: ID.make(),
        title,
    }
}

export function setPosition(t: T, position: number, parent: Note.T["id"]): T {
    return {
        ...t,
        parents: { [parent]: position },
    }
}

export function getNextPosition(paragraphs: T[], parent: Note.T["id"]): number {
    const STEP = 100;
    const largestPosition = paragraphs
        .map(({ parents }) => parents[parent])
        .reduce((largest, current) => Math.max(largest, current), 0);
    return STEP + largestPosition;
}
