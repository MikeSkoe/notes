import { createEffect, sample, Unit } from "effector";

import { Loader, Note, Paragraph, Service } from "..";

import { Actions, Root } from "./root";

export function action(
	root: Root,
	[paragraphId, noteId]: [Paragraph.T["id"], Note.T["id"]],
): Root {
	return Loader.map(root, state => ({
		...state,
		paragraphs: state.paragraphs.map(p => p.id === paragraphId
			? Paragraph.linkToNote(p, noteId)
			: p),
	}));
}

export function FX(
	actions: Actions,
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
	sample({
		clock: actions.linkParagraphToNote,
		fn: (selectedNote, [paragraphId, noteId]) => ({ selectedNote, paragraphId, noteId } as const),
		source: selectedNote$,
		target: createEffect(effect),
	});

	async function effect({ selectedNote, paragraphId, noteId }: {
		selectedNote: Note.T["id"],
		paragraphId: Paragraph.T["id"],
		noteId: Note.T["id"],
	}) {
		const paragraph = await paragraphService.get(paragraphId);
		await paragraphService.set(Paragraph.linkToNote(paragraph, noteId));
		const newParagraphs = await paragraphService.getByParentId(selectedNote);
		actions.paragraphsLoaded(newParagraphs);
	}
}