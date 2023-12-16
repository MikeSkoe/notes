export type WithId = { id: string; }
export type WithParents<A extends WithId> = { parents: Record<A["id"], number>; }

export const make = (): string => `${Math.round(Math.random() * 10000)}`;
