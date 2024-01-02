import { Loader, Selected } from "..";
import { Root } from "./root";

export function back(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		selected: Selected.back(state.selected),
	}))
}

export function front(root: Root): Root {
	return Loader.map(root, state => ({
		notes: state.notes,
		selected: Selected.front(state.selected),
	}))
}
