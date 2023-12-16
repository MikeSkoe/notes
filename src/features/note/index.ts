import { Id } from "..";

export type T = Id.WithId & { title: string; };

export const EMPTY: T = { id: Id.make(), title: "empty note" };

export const make = (title: string): T => ({ id: Id.make(), title });
