import { createEvent } from "effector";

import { Loader, Selected } from "..";

import { Root } from "./root";

// --- Events ---
export const back = createEvent();
export const front = createEvent();

// --- Reducers ---
export function onBack(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		selected: Selected.back(state.selected),
	}))
}

export function onFront(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		selected: Selected.front(state.selected),
	}))
}
