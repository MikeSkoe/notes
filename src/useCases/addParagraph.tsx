import { Unit, createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph, Selected, FP } from "..";

import { Root, Actions, Page } from "./root";

// Add paragraph

/**
 * Takes string, so that effect generates a new paragraph based on it and use it with both action and service
 */
export function preAction(root: Root, _: string): Root | void {
    return root;
} 

export function addParagraph(root: Root, newParagraph: Paragraph.T): Root | void {
    if (!newParagraph.title || Loader.isLoading(root)) {
        return;
    }

    return Loader.map(root, ({ notes, selected }) => ({
        notes,
        selected: Selected.update<Page>(
            ({ noteId, paragraphs }) => ({
                noteId,
                paragraphs: paragraphs.concat(newParagraph),
            }),
        )(selected),
    }));
}

export function updateParagraphs(root: Root, paragraphs: Paragraph.T[]): Root {
    return Loader.map(root, ({ notes, selected }) => ({
        notes,
        selected: Selected.update<Page>(({ noteId }) => ({ noteId, paragraphs }))(selected),
    }))
}

/**
 * Add a new paragraph to the service and load the new list of paragraphs
 */
export function FX(
    actions: Actions,
    root$: Unit<Root>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.addNewParagraph,
        source: root$,
        fn: (root: Root, title: string) => [root, title] as const,
        target: createEffect(effect),
    });

    async function effect([root, title]: [Root, string]) {
        if (!title || Loader.isLoading(root)) {
            return;
        }

        const { paragraphs, noteId } = FP.pipe(
            Selected.getCurrent,
            Selected.getLast,
        )(root.data.selected);

        const newParagraph = Paragraph.setPosition(
            Paragraph.make(title),
            Paragraph.getNextPosition(paragraphs, noteId),
            noteId,
        );

        actions.addParagraph(newParagraph);
        await paragraphService.set(newParagraph);

        actions.updateParagraphs(await paragraphService.getByParentId(noteId));
    }
}
