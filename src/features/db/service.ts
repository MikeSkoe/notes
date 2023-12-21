import { ID } from "..";

export interface Service<Item extends ID.WithId> {
    set: (item: Item) => Promise<void>;
    get: (id: Item["id"]) => Promise<Item>;
    getAll: () => Promise<Item[]>;
    delete: (id: Item["id"]) => Promise<void>;
}

export interface RelationalService<
    Parent extends ID.WithId,
    Item extends ID.WithId,
> extends Service<Item> {
    getByParentId: (id: Parent["id"]) => Promise<Item[]>;
}

