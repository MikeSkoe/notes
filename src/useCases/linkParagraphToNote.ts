import { createEffect, createEvent, sample, Store, Unit } from "effector";

import { Loader, Note, Paragraph, Service } from "..";

import { Root } from "./root";
import { updateParagraphs } from "./updateParagraphs";

export const linkParagraphToNote = createEvent<[Paragraph.T["id"], Note.T["id"]]>();

export function onLinkParagraphToNote(
	store: Store<Root>,
    selectedNote$: Unit<Note.T["id"]>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
	store.on(linkParagraphToNote, reducer);

	sample({
		clock: linkParagraphToNote,
		fn: (selectedNote, [paragraphId, noteId]) => ({ selectedNote, paragraphId, noteId } as const),
		source: selectedNote$,
		target: createEffect(effect),
	});

	function reducer(root: Root, [paragraphId, linkTo]: [Paragraph.T["id"], Note.T["id"]]): Root {
		return Loader.map(root, state => ({
			...state,
			paragraphs: Object.values(state.paragraphs).reduce(
				(acc, paragraph) => ({
					...acc,
					[paragraph.id]: paragraph.id === paragraphId
						? Paragraph.linkToNote(paragraph, linkTo)
						: paragraph,
				}),
				{} as Record<Paragraph.T["id"], Paragraph.T>,
			),
		}));
	}

	async function effect({ selectedNote, paragraphId, noteId }: {
		selectedNote: Note.T["id"],
		paragraphId: Paragraph.T["id"],
		noteId: Note.T["id"],
	}) {
		const paragraph = await paragraphService.get(paragraphId);
		await paragraphService.set(Paragraph.linkToNote(paragraph, noteId));
		updateParagraphs(await paragraphService.getByParentId(selectedNote));
	}
}
