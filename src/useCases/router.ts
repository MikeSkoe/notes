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
		history: History.back(state.history),
	}))
}

export function onFront(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		history: History.front(state.history),
	}))
}
