import { Id } from "..";

export type T = Id.WithId & { title: string; };

export const UNSORTED: T = { id: "unsorted", title: "Unsorted" };

export const make = (title: string): T => ({ id: Id.make(), title });
