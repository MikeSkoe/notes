import { ID } from "..";

export type T = ID.WithId & { title: string; };

export const UNSORTED: T = { id: "unsorted", title: "Unsorted" };

export const make = (title: string): T => ({ id: ID.make(), title });
