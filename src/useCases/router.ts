import { createEvent, Store } from "effector";

import { Loader, History } from "..";

import { Root } from "./root";

export const back = createEvent();
export const front = createEvent();

export function onRoute(store: Store<Root>) {
	store.on(back, backReducer);
	store.on(front, frontReducer);

	function backReducer(root: Root): Root {
		return Loader.map(root, state => ({
			notes: state.notes,
			history: History.back(state.history),
			notesParagraphs: state.notesParagraphs,
		}))
	}

	function frontReducer(root: Root): Root {
		return Loader.map(root, state => ({
			notes: state.notes,
			history: History.front(state.history),
			notesParagraphs: state.notesParagraphs,
		}))
	}
}
