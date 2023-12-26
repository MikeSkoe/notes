import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, Note, Store } from "../..";

type Props = {
	onSelect: (noteId: Note.T["id"]) => void;
	excludeIds: Note.T["id"][];
	goBack: () => void;
}

export function Select({ onSelect, goBack, excludeIds }: Props) {
	const root$ = useContext(Store.StoreContext);
	const notes = useStoreMap(root$, root => Loader.getMapWithDefault(
		root.notes,
		notes => notes.items.filter(note => !excludeIds.includes(note.id)),
		[],
	));

	if (notes.length === 0) {
		return <>
			<p>no notes to link to</p>
			<button onClick={goBack}>go back</button>
		</>;
	}

	return <ul>{notes.map(note =>
		<li key={note.id} onClick={() => onSelect(note.id)}>
			{note.title}
		</li>
	)}</ul>
}
