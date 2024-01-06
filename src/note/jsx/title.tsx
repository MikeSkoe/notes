import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, Note, Store } from "../..";

export function Title({ id }: { id: Note.T["id"] }) {
	const root = useContext(Store.StoreContext);
	const title = useStoreMap(root, state => Loader.getMapWithDefault(
		state,
		({ notes }) => notes.find(note => note.id === id)?.title ?? "??",
		"??",
	));

	return <span>{title}</span>;
}
