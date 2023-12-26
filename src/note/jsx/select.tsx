import { useStoreMap } from "effector-react";
import { useContext } from "react";
import { Loader, Note, Store } from "../..";

type Props = {
	onSelect: (noteId: Note.T["id"]) => void;
}

export function Select({ onSelect }: Props) {
	const root$ = useContext(Store.StoreContext);
	const notes = useStoreMap(root$, root => Loader.getMapWithDefault(root.notes, notes => notes.items, []));

	return <ul>{notes.map(note =>
		<li key={note.id} onClick={() => onSelect(note.id)}>
			{note.title}
		</li>
	)}</ul>
}
