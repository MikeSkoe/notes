import { createEffect, createEvent, sample, Unit } from "effector";

import { Loader, Note, Paragraph, Service } from "..";
import { updateParagraphs } from "./addParagraph";

import { Root } from "./root";

// Make a paragraph link to another note

// --- Events ---

export const linkParagraphToNote = createEvent<[Paragraph.T["id"], Note.T["id"]]>();

// --- Reducers ---

export function onLinkParagraphToNote(
	root: Root,
	[paragraphId, linkTo]: [Paragraph.T["id"], Note.T["id"]],
): Root {
	return Loader.map(root, state => ({
		...state,
		notesParagraphs: Object.keys(state.notesParagraphs).reduce(
			(acc: Loader.Unwrap<Root>["notesParagraphs"], noteId: Note.T["id"]) => ({
				...acc,
				[noteId]: state.notesParagraphs[noteId].map(
					paragraph => paragraph.id === paragraphId
						? Paragraph.linkToNote(paragraph, linkTo)
						: paragraph,
				)
			}),
			{},
		),
	}));
}

// --- FXs ---

export function linkParagraphToNoteFX(
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
	sample({
		clock: linkParagraphToNote,
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
		updateParagraphs(
			await paragraphService.getByParentId(selectedNote),
		);
	}
}