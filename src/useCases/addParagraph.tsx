import { Unit, createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph } from "..";

import { Root, Actions } from "./root";

// Add paragraph

export function action(root: Root, newParagraph: Paragraph.T): Root | void {
    if (!newParagraph.title || Loader.isLoading(root.notes) || Loader.isLoading(root.paragraphs)) {
        return;
    }

    return {
        notes: root.notes,
        paragraphs: Loader.loaded({
            items: root.paragraphs.data.items.concat(newParagraph),
        }),
    };
}

/**
 * Takes string, so that effect generates a new paragraph based on it and use it with both action and service
 */
export function preAction(root: Root, _: string): Root | void {
    return root;
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
        target: createEffect<[Root, string], void>(async ([root, title]) => {
            if (!title || Loader.isLoading(root.notes) || Loader.isLoading(root.paragraphs)) {
                return;
            }
            const selectedNote = root.notes.data.selected;
            const paragraphs = root.paragraphs.data.items;
            const newParagraph = Paragraph.setPosition(
                Paragraph.make(title),
                Paragraph.getNextPosition(paragraphs, selectedNote),
                selectedNote,
            );

            actions.addParagraph(newParagraph);
            paragraphService.set(newParagraph);
            const newParagraphs = await paragraphService.getByParentId(selectedNote);
            actions.paragraphsLoaded(newParagraphs);
        }),
    });
}
