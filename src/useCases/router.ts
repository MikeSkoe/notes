import { createEvent } from "effector";

import { Loader, History } from "..";

import { Root } from "./root";

// --- Events ---
export const back = createEvent();
export const front = createEvent();

// --- Reducers ---
export function onBack(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		selected: History.back(state.selected),
	}))
}

export function onFront(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		selected: History.front(state.selected),
	}))
}
