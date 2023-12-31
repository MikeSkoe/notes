import { useStoreMap } from "effector-react";
import { useContext } from "react";

import { Loader, LoaderJSX, Note, Store } from "../..";
import { Title } from "./title";

type Props = {
	onSelect: (noteId: Note.T["id"]) => void;
	excludeIds: Note.T["id"][];
	goBack: () => void;
}

export function Select({ onSelect, goBack, excludeIds }: Props) {
	const root$ = useContext(Store.StoreContext);
	const loadableNotes = useStoreMap(root$, root => Loader.map(root, root =>
		Object.values(root.notes).filter(note => !excludeIds.includes(note.id)),
	));

	return <LoaderJSX.Show loadable={loadableNotes}>
		{notes => 
			notes.length === 0
				? <button onClick={goBack}>go back</button>
				: <ul>{notes.map(note =>
					<li key={note.id} onClick={() => onSelect(note.id)}>
						<Title id={note.id} />
					</li>
				)}</ul>
		}
	</LoaderJSX.Show>
}
